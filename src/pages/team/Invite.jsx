import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as I from "../../styles/team/InviteStyle";

import X from "../../assets/images/X.png";
import book from "../../assets/images/book.png";
import linkCoral from "../../assets/images/link_coral.png";
import userPink from "../../assets/images/user_pink.png";
import userBlue from "../../assets/images/user_blue.png";
import userGreen from "../../assets/images/user_green.png";
import more from "../../assets/images/more.png";
import checkIcon from "../../assets/images/check.svg";

import { createTeam } from "../../api/team";
import { getBook } from "../../api/book";
import { getUser } from "../../api/auth";

const COLOR_IMAGE_MAP = {
    PINK: userPink,
    BLUE: userBlue,
    GREEN: userGreen,
};

function Invite() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState("");
    const [bookData, setBookData] = useState(null);
    const [teamUserData, setTeamUserData] = useState([]);
    const [inviteToken, setInviteToken] = useState("");
    const [userMap, setUserMap] = useState({});
    const isSubmittingRef = useRef(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await getBook(bookId);
                setBookData(data);
            } catch (error) {
                alert(error.response?.data?.message || "책 정보를 불러오는데 실패했습니다.");
            }
        };
        fetchBook();
    }, [bookId]);

    const handleCreate = async () => {
        if (!teamName.trim()) return;
        if (inviteToken || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        try {
            const [response, usersResult] = await Promise.allSettled([
                createTeam({ teamName: teamName.trim(), bookId: Number(bookId) }),
                getUser(),
            ]);

            if (response.status === "rejected") throw response.reason;

            const data = response.value;
            setTeamUserData(data.teamData.teamUserData);
            const url = data.teamData.inviteUrl;
            const token = url ? new URLSearchParams(url.split("?")[1]).get("token") : null;
            setInviteToken(token);
            setBookData(data.bookData);

            if (usersResult.status === "fulfilled") {
                const users = Array.isArray(usersResult.value) ? usersResult.value : (usersResult.value?.data ?? []);
                const map = {};
                users.forEach((u) => {
                    map[u.id] = { nickname: u.nickname ?? u.email, profileImage: u.profileImage ?? null };
                });
                setUserMap(map);
            }
        } catch (error) {
            const status = error.response?.data?.statusCode;
            const message = error.response?.data?.message;

            if (status === 400 && message === "사용 가능한 요금제가 없습니다.") {
                alert("사용 가능한 요금제가 없습니다. 요금제 페이지로 이동합니다.");
                navigate("/pricing");
            } else {
                alert(message || "팀 생성에 실패했습니다.");
            }
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const handleCopyLink = async () => {
        if (!inviteToken) return;
        const frontendUrl = `${window.location.origin}/join/${inviteToken}`;
        await navigator.clipboard.writeText(frontendUrl);
        alert("링크가 복사되었습니다.");
    };

    return (
        <I.Invite>
            <I.InviteContainer>
                <I.InviteHeader>
                    <I.BackIcon src={X} onClick={() => navigate(-1)} />
                </I.InviteHeader>
                <I.BookWrapper>
                    <I.Book src={bookData?.bookImage || book} />
                    <I.BookDesc>
                        {bookData
                            ? `${bookData.title}, ${bookData.author}`
                            : "가을, 김유정"}
                    </I.BookDesc>
                </I.BookWrapper>
                <I.InputWrapeer>
                    <I.InputFeild
                        placeholder="팀 이름을 입력해주세요"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    {inviteToken ? (
                        <I.CheckIcon src={checkIcon} />
                    ) : (
                        <I.ConfirmButton onClick={handleCreate} disabled={!teamName.trim()}>
                            확인
                        </I.ConfirmButton>
                    )}
                </I.InputWrapeer>
                <I.LinkContainer>
                    <I.LinkWrapper>
                        <I.LinkIcon src={linkCoral} />
                        <I.LinkContent>
                            <I.LinkTitle>
                                Shareable Link is now ready!
                            </I.LinkTitle>
                            <I.LinkSub>
                                링크를 생성하고 친구랑 같이 읽어 보세요.
                            </I.LinkSub>
                        </I.LinkContent>
                    </I.LinkWrapper>
                    <I.LinkButton onClick={handleCopyLink} disabled={!inviteToken}>
                        Copy Link
                    </I.LinkButton>
                </I.LinkContainer>
                <I.ListContainer>
                    {teamUserData.map((user) => (
                        <I.ListWrapper key={user.id}>
                            <I.ListContent>
                                <I.Profile
                                    src={userMap[user.userId]?.profileImage || COLOR_IMAGE_MAP[user.userColor] || userPink}
                                    onError={(e) => { e.currentTarget.src = userPink; }}
                                />
                                <I.Username>{userMap[user.userId]?.nickname ?? user.userId}</I.Username>
                            </I.ListContent>
                            <I.More src={more} />
                        </I.ListWrapper>
                    ))}
                </I.ListContainer>
            </I.InviteContainer>
        </I.Invite>
    );
}

export default Invite;
