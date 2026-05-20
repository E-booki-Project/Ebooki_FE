import React, { useEffect, useRef, useState } from "react";
import * as SC from "../styles/components/SideCommentStyle";
import { addHighlightComment, addEmoticon, updateComment, deleteComment } from "../api/reading";
import { getUser } from "../api/auth";
import { getUserInfo } from "../utils/authStorage";

import tape_blue from "../assets/images/tape_blue.png";
import tape_green from "../assets/images/tape_green.png";
import tape_pink from "../assets/images/tape_pink.png";
import tape_yellow from "../assets/images/tape_yellow.png";

import user_blue from "../assets/images/user_blue.png";
import user_green from "../assets/images/user_green.png";
import user_pink from "../assets/images/user_pink.png";
import user_yellow from "../assets/images/user_yellow.png";

import more from "../assets/images/morehorizontal.png";
import smile_grey from "../assets/images/smile_grey.png";
import smile_coral from "../assets/images/smile_coral.png";
import thumbsup_grey from "../assets/images/thumbsup_grey.png";
import thumbsup_coral from "../assets/images/thumbsup_coral.png";
import enter from "../assets/images/enter.png";

const TAPE_MAP = {
    BLUE: tape_blue,
    GREEN: tape_green,
    PINK: tape_pink,
    YELLOW: tape_yellow,
};

const USER_ICON_MAP = {
    BLUE: user_blue,
    GREEN: user_green,
    PINK: user_pink,
    YELLOW: user_yellow,
};

const HIGHLIGHT_COLOR_MAP = {
    BLUE: "rgba(137, 209, 217, 0.30)",
    GREEN: "rgba(205, 242, 167, 0.30)",
    PINK: "rgba(242, 148, 156, 0.30)",
    YELLOW: "rgba(242, 207, 102, 0.30)",
};

function HighlightCard({ highlight, teamId, userMap }) {
    const currentUserId = getUserInfo()?.id;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [comments, setComments] = useState(highlight.comments ?? []);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const inputRef = useRef(null);
    const isComposingRef = useRef(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!openMenuId) return;
        const handleOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [openMenuId]);

    const handleEditStart = (c) => {
        setOpenMenuId(null);
        setEditingId(c.id);
        setEditText(c.text);
    };

    const handleEditSubmit = async (commentId) => {
        const text = editText.trim();
        if (!text) return;
        try {
            await updateComment(teamId, commentId, text);
            setComments((prev) =>
                prev.map((c) => (c.id === commentId ? { ...c, text } : c))
            );
        } catch { /* ignore */ }
        setEditingId(null);
        setEditText("");
    };

    const handleDelete = async (commentId) => {
        setOpenMenuId(null);
        try {
            await deleteComment(teamId, commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch { /* ignore */ }
    };

    useEffect(() => {
        setComments(highlight.comments ?? []);
    }, [highlight.comments]);

    const submitReply = async () => {
        const text = replyText.trim();
        if (!text || !highlight.id || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const newComment = await addHighlightComment(teamId, highlight.id, text);
            setComments((prev) => [...prev, newComment]);
            setReplyText("");
        } catch { /* ignore */ } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmoticon = async (commentId, type) => {
        const field = type === "SMILE" ? "smiled" : "liked";
        const countField = type === "SMILE" ? "smileCount" : "likeCount";
        setComments((prev) =>
            prev.map((c) => {
                if (c.id !== commentId) return c;
                const wasActive = c.myEmoticon?.[field];
                return {
                    ...c,
                    myEmoticon: { ...c.myEmoticon, [field]: !wasActive },
                    emoticons: {
                        ...c.emoticons,
                        [countField]: Math.max(0, (c.emoticons?.[countField] ?? 0) + (wasActive ? -1 : 1)),
                    },
                };
            })
        );
        try {
            const result = await addEmoticon(teamId, commentId, type);
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? { ...c, emoticons: { smileCount: result.smileCount, likeCount: result.likeCount } }
                        : c
                )
            );
        } catch { /* optimistic stays */ }
    };

    const autoResize = (el) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const onKeyDown = (e) => {
        if (isComposingRef.current) return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            submitReply();
        }
    };

    const tapeImage = TAPE_MAP[highlight.color] ?? tape_pink;
    const fallbackIcon = USER_ICON_MAP[highlight.color] ?? USER_ICON_MAP.PINK;
    const highlightColor = HIGHLIGHT_COLOR_MAP[highlight.color] ?? HIGHLIGHT_COLOR_MAP.BLUE;

    return (
        <SC.SideComment onClick={() => setIsCollapsed((prev) => !prev)}>
            <SC.Tape src={tapeImage} />
            <SC.BookQuotes $color={highlightColor}>
                <span className="highlight">{highlight.text}</span>
            </SC.BookQuotes>

            {!isCollapsed && <div style={{ marginTop: "20px" }} onClick={(e) => e.stopPropagation()}>
                    {comments.map((c) => {
                        const author = userMap?.[c.userId];
                        return (
                            <SC.CommentContainer key={c.id}>
                                <SC.CommentHeader>
                                    <SC.Profile>
                                        <SC.ProfileIcon
                                            src={author?.profileImage || fallbackIcon}
                                            onError={(e) => { e.currentTarget.src = fallbackIcon; }}
                                        />
                                        <SC.ProfileName>{author?.nickname ?? "알 수 없음"}</SC.ProfileName>
                                    </SC.Profile>
                                    {Number(c.userId) === Number(currentUserId) && (
                                        <SC.MoreWrapper ref={openMenuId === c.id ? menuRef : null}>
                                            <SC.MoreIcon
                                                src={more}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === c.id ? null : c.id);
                                                }}
                                            />
                                            {openMenuId === c.id && (
                                                <SC.MoreMenu>
                                                    <SC.MoreMenuItem
                                                        onClick={(e) => { e.stopPropagation(); handleEditStart(c); }}
                                                    >
                                                        수정
                                                    </SC.MoreMenuItem>
                                                    <SC.MoreMenuDivider />
                                                    <SC.MoreMenuItem
                                                        $danger
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                                                    >
                                                        삭제
                                                    </SC.MoreMenuItem>
                                                </SC.MoreMenu>
                                            )}
                                        </SC.MoreWrapper>
                                    )}
                                </SC.CommentHeader>

                                {editingId === c.id ? (
                                    <SC.InputWrapper
                                        style={{ marginBottom: "8px" }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <SC.Input
                                            rows={1}
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onInput={(e) => autoResize(e.target)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSubmit(c.id); }
                                                if (e.key === "Escape") { setEditingId(null); }
                                            }}
                                            autoFocus
                                        />
                                        <SC.EnterIcon
                                            src={enter}
                                            onClick={() => handleEditSubmit(c.id)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </SC.InputWrapper>
                                ) : (
                                    <SC.CommentText>{c.text}</SC.CommentText>
                                )}

                                <SC.CommentReaction>
                                    <SC.ReactionWrapper
                                        onClick={() => handleEmoticon(c.id, "SMILE")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <SC.ReactionIcon
                                            src={c.myEmoticon?.smiled ? smile_coral : smile_grey}
                                        />
                                        <SC.ReactionCount $active={c.myEmoticon?.smiled}>
                                            {c.emoticons?.smileCount ?? 0}
                                        </SC.ReactionCount>
                                    </SC.ReactionWrapper>

                                    <SC.ReactionWrapper
                                        onClick={() => handleEmoticon(c.id, "LIKE")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <SC.ReactionIcon
                                            src={c.myEmoticon?.liked ? thumbsup_coral : thumbsup_grey}
                                        />
                                        <SC.ReactionCount $active={c.myEmoticon?.liked}>
                                            {c.emoticons?.likeCount ?? 0}
                                        </SC.ReactionCount>
                                    </SC.ReactionWrapper>
                                </SC.CommentReaction>
                            </SC.CommentContainer>
                        );
                    })}

                    {!highlight.isLocal && (
                        <SC.InputWrapper style={{ marginTop: comments.length > 0 ? "10px" : "0" }}>
                            <SC.Input
                                rows={1}
                                ref={inputRef}
                                placeholder="답글 추가"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onInput={(e) => autoResize(e.target)}
                                onKeyDown={onKeyDown}
                                onCompositionStart={() => { isComposingRef.current = true; }}
                                onCompositionEnd={(e) => {
                                    isComposingRef.current = false;
                                    setReplyText(e.target.value);
                                }}
                            />
                            <SC.EnterIcon
                                src={enter}
                                onClick={submitReply}
                                style={{ cursor: "pointer" }}
                            />
                        </SC.InputWrapper>
                    )}
                </div>}
        </SC.SideComment>
    );
}

function SideComment({ highlights = [], teamId, onDelete }) {
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        getUser().then((data) => {
            const users = Array.isArray(data) ? data : (data?.data ?? []);
            const map = {};
            users.forEach((u) => { map[u.id] = u; });
            setUserMap(map);
        }).catch(() => {});
    }, []);

    return (
        <SC.CardList>
            {highlights.map((h, i) => (
                <HighlightCard
                    key={h.id ?? `local-${i}`}
                    highlight={h}
                    teamId={teamId}
                    userMap={userMap}
                    onDelete={onDelete}
                />
            ))}
        </SC.CardList>
    );
}

export default SideComment;
