import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as I from "../../styles/team/InviteStyle";

import X from "../../assets/images/X.png";
import book from "../../assets/images/book.png";
import linkCoral from "../../assets/images/link_coral.png";
import userPink from "../../assets/images/user_pink.png";
import userBlue from "../../assets/images/user_blue.png";
import userGreen from "../../assets/images/user_green.png";
import more from "../../assets/images/more.png";

import { getTeamDetail, updateTeam, reissueInviteLink } from "../../api/team";
import { getUser } from "../../api/auth";

const COLOR_IMAGE_MAP = {
    PINK: userPink,
    BLUE: userBlue,
    GREEN: userGreen,
};

function EditTeam() {
    const { teamId } = useParams();
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState("");
    const [bookData, setBookData] = useState(null);
    const [teamUserData, setTeamUserData] = useState([]);
    const [inviteToken, setInviteToken] = useState(null);
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        const fetchTeamDetail = async () => {
            try {
                const [response, userResult] = await Promise.all([
                    getTeamDetail(teamId),
                    getUser(),
                ]);
                setTeamName(response.teamData.teamData.teamName);
                setTeamUserData(response.teamData.teamUserData);
                setBookData(response.bookData);

                const users = userResult.data ?? userResult;
                if (Array.isArray(users)) {
                    const map = {};
                    users.forEach((u) => {
                        map[u.id] = { nickname: u.nickname ?? u.email, profileImage: u.profileImage ?? null };
                    });
                    setUserMap(map);
                }
                const inviteUrl = response.teamData.inviteUrl;
                const token = inviteUrl ? new URLSearchParams(inviteUrl.split("?")[1]).get("token") : null;
                if (token) {
                    setInviteToken(token);
                } else {
                    const reissueRes = await reissueInviteLink(teamId);
                    const newUrl = reissueRes.teamData.newUrl;
                    const newToken = newUrl ? new URLSearchParams(newUrl.split("?")[1]).get("token") : null;
                    if (newToken) setInviteToken(newToken);
                }
            } catch (error) {
                alert(error.response?.data?.message || "팀 정보를 불러오는데 실패했습니다.");
            }
        };
        fetchTeamDetail();
    }, [teamId]);

    const handleUpdate = async () => {
        if (!teamName.trim()) return;
        try {
            await updateTeam(teamId, teamName.trim());
        } catch (error) {
            alert(error.response?.data?.message || "팀 이름 수정에 실패했습니다.");
        }
    };

    const handleCopyLink = () => {
        if (!inviteToken) return;
        const frontendUrl = `${window.location.origin}/join/${inviteToken}`;
        navigator.clipboard.writeText(frontendUrl).then(() => {
            alert("링크가 복사되었습니다.");
        }).catch(() => {
            alert("링크가 복사되었습니다.");
        });
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
                            : ""}
                    </I.BookDesc>
                </I.BookWrapper>
                <I.InputWrapeer>
                    <I.InputFeild
                        placeholder="팀 이름을 입력해주세요"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                    />
                    <I.BackIcon
                        src={X}
                        style={{ width: "16px", height: "16px" }}
                        onClick={() => setTeamName("")}
                    />
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
                    <I.LinkButton onClick={handleCopyLink}>
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

export default EditTeam;
