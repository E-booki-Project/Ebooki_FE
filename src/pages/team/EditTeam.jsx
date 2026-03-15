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

import { getTeamList, updateTeam, reissueInviteLink } from "../../api/team";

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

    useEffect(() => {
        const fetchTeamDetail = async () => {
            try {
                const response = await getTeamList();
                const team = response.teams.find(
                    (t) => t.teamId === Number(teamId)
                );
                if (!team) {
                    alert("팀 정보를 찾을 수 없습니다.");
                    return;
                }
                setTeamName(team.teamName);
                setTeamUserData(
                    team.memberProfileImages.map((url, index) => ({
                        id: index,
                        userColor: null,
                        userId: "",
                        image: url,
                    }))
                );
                setBookData({
                    bookImage: team.bookImage,
                    title: team.bookTitle,
                    author: "",
                });
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

    const handleCopyLink = async () => {
        try {
            const response = await reissueInviteLink(teamId);
            const newUrl = response.teamData.newUrl;
            const token = newUrl ? new URLSearchParams(newUrl.split("?")[1]).get("token") : null;
            if (!token) {
                alert("초대 링크 생성에 실패했습니다.");
                return;
            }
            const frontendUrl = `${window.location.origin}/join/${token}`;
            await navigator.clipboard.writeText(frontendUrl);
            alert("링크가 복사되었습니다.");
        } catch (error) {
            alert(error.response?.data?.message || "초대 링크 재생성에 실패했습니다.");
        }
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
                                    src={
                                        COLOR_IMAGE_MAP[user.userColor] ||
                                        user.image ||
                                        userPink
                                    }
                                />
                                <I.Username>{user.userId}</I.Username>
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
