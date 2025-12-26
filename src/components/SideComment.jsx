import React, { useRef, useState } from "react";
import * as SC from "../styles/components/SideCommentStyle";

import tape_pink from "../assets/images/tape_pink.png";
import user_pink from "../assets/images/user_pink.png";

import more from "../assets/images/morehorizontal.png";
import smile_grey from "../assets/images/smile_grey.png";
import smile_coral from "../assets/images/smile_coral.png";
import thumbsup_grey from "../assets/images/thumbsup_grey.png";
import thumbsup_coral from "../assets/images/thumbsup_coral.png";
import enter from "../assets/images/enter.png";

function SideComment({ quote = "" }) {
    const [replyInput, setReplyInput] = useState("");
    const [comments, setComments] = useState([]);

    const inputRef = useRef(null);
    const isComposingRef = useRef(false);

    const submitLockRef = useRef(false);
    const lockSubmit = (ms = 150) => {
        submitLockRef.current = true;
        window.setTimeout(() => (submitLockRef.current = false), ms);
    };

    const submitReply = () => {
        if (submitLockRef.current) return;

        const text = replyInput.trim();
        if (!text) return;

        lockSubmit();

        const newComment = {
            id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
            text,
            smileActive: false,
            thumbActive: false,
        };

        setComments((prev) => [...prev, newComment]);
        setReplyInput("");
        window.setTimeout(() => {
            if (inputRef.current) inputRef.current.value = "";
        }, 0);
    };

    const onKeyDown = (e) => {
        if (isComposingRef.current) return;

        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            submitReply();
        }
    };

    const onClickEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        submitReply();
    };

    const toggleReaction = (id, type) => {
        setComments((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;

                if (type === "smile")
                    return { ...c, smileActive: !c.smileActive };
                if (type === "thumb")
                    return { ...c, thumbActive: !c.thumbActive };
                return c;
            })
        );
    };

    return (
        <SC.SideComment>
            <SC.Tape src={tape_pink} />

            <SC.Content>
                <SC.BookQuotes>
                    <span className="highlight">
                        {quote || "하이라이트한 문장이 여기에 표시됩니다."}
                    </span>
                </SC.BookQuotes>

                {comments.map((c) => (
                    <SC.CommentContainer key={c.id}>
                        <SC.CommentHeader>
                            <SC.Profile>
                                <SC.ProfileIcon src={user_pink} />
                                <SC.ProfileName>닉네임</SC.ProfileName>
                            </SC.Profile>
                            <SC.MoreIcon src={more} />
                        </SC.CommentHeader>

                        <SC.CommentText>{c.text}</SC.CommentText>

                        <SC.CommentReaction>
                            <SC.ReactionWrapper
                                onClick={() => toggleReaction(c.id, "smile")}
                            >
                                <SC.ReactionIcon
                                    src={
                                        c.smileActive ? smile_coral : smile_grey
                                    }
                                />
                                <SC.ReactionCount $active={c.smileActive}>
                                    {c.smileActive ? 1 : 0}
                                </SC.ReactionCount>
                            </SC.ReactionWrapper>

                            <SC.ReactionWrapper
                                onClick={() => toggleReaction(c.id, "thumb")}
                            >
                                <SC.ReactionIcon
                                    src={
                                        c.thumbActive
                                            ? thumbsup_coral
                                            : thumbsup_grey
                                    }
                                />
                                <SC.ReactionCount $active={c.thumbActive}>
                                    {c.thumbActive ? 1 : 0}
                                </SC.ReactionCount>
                            </SC.ReactionWrapper>
                        </SC.CommentReaction>
                    </SC.CommentContainer>
                ))}
            </SC.Content>

            <SC.InputWrapper>
                <SC.Input
                    ref={inputRef}
                    placeholder="답글 추가"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onCompositionStart={() => {
                        isComposingRef.current = true;
                    }}
                    onCompositionEnd={(e) => {
                        isComposingRef.current = false;
                        setReplyInput(e.target.value);
                    }}
                />

                <SC.EnterIcon
                    src={enter}
                    onClick={onClickEnter}
                    style={{ cursor: "pointer" }}
                />
            </SC.InputWrapper>
        </SC.SideComment>
    );
}

export default SideComment;
