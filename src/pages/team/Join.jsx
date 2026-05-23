import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as J from "../../styles/team/JoinStyle";

import book from "../../assets/images/book.png";
import Plus from "../../assets/images/plus.png";
import userPink from "../../assets/images/user_pink.png";
import userBlue from "../../assets/images/user_blue.png";
import userGreen from "../../assets/images/user_green.png";
import userYellow from "../../assets/images/user_yellow.png";

import { joinTeam, acceptInvite } from "../../api/team";
import { getUser } from "../../api/auth";
import { isLoggedIn, getUserInfo } from "../../utils/authStorage";

const COLOR_IMAGE_MAP = {
    PINK: userPink,
    BLUE: userBlue,
    GREEN: userGreen,
};

function Join() {
    const { teamId: token } = useParams();
    const navigate = useNavigate();
    const [teamData, setTeamData] = useState(null);
    const [bookData, setBookData] = useState(null);
    const [teamUserData, setTeamUserData] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [myProfileImage, setMyProfileImage] = useState(null);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const [inviteRes, usersRes] = await Promise.allSettled([
                    joinTeam(token),
                    getUser(),
                ]);

                if (inviteRes.status === "rejected") throw inviteRes.reason;

                const response = inviteRes.value;
                setTeamData(response.teamData.teamData);
                setTeamUserData(response.teamData.teamUserData);
                setBookData(response.bookData);

                if (usersRes.status === "fulfilled") {
                    const users = Array.isArray(usersRes.value) ? usersRes.value : (usersRes.value?.data ?? []);
                    const map = {};
                    users.forEach((u) => { map[u.id] = u.profileImage ?? null; });
                    setUserMap(map);

                    const myId = getUserInfo()?.id;
                    if (myId != null) setMyProfileImage(map[myId] ?? null);
                }
            } catch (error) {
                alert(error.response?.data?.message || "초대 정보를 불러오는데 실패했습니다.");
            }
        };
        fetchInvite();
    }, [token]);

    const handleAccept = async () => {
        if (!isLoggedIn()) {
            navigate("/signin");
            return;
        }

        try {
            await acceptInvite(token);
            navigate("/teams");
        } catch (error) {
            const message = error.response?.data?.message;
            const status = error.response?.data?.statusCode;

            if (status === 400 && message === "사용 가능한 요금제가 없습니다.") {
                alert("사용 가능한 요금제가 없습니다. 요금제 페이지로 이동합니다.");
                navigate("/pricing");
            } else {
                alert(message || "초대 수락에 실패했습니다.");
            }
        }
    };

    return (
        <J.Join>
            <J.JoinContainer>
                <J.BookWrapper>
                    <J.Book src={bookData?.bookImage || book} />
                    <J.BookDesc>
                        {bookData
                            ? `${bookData.title}, ${bookData.author}`
                            : "책을 불러올 수 없습니다."}
                    </J.BookDesc>
                </J.BookWrapper>
                <J.GroupContainer>
                    <J.Group>
                        {teamUserData.map((user) => (
                            <J.Profile
                                key={user.id}
                                src={userMap[user.userId] || COLOR_IMAGE_MAP[user.userColor] || userPink}
                                onError={(e) => { e.currentTarget.src = COLOR_IMAGE_MAP[user.userColor] || userPink; }}
                            />
                        ))}
                    </J.Group>
                    <J.Plus src={Plus} />
                    <J.JoinProfile
                        src={myProfileImage || userYellow}
                        onError={(e) => { e.currentTarget.src = userYellow; }}
                    />
                </J.GroupContainer>
                <J.JoinContent>{teamData?.teamName}</J.JoinContent>
                <J.ButtonWrapper>
                    <J.AcceptButton onClick={handleAccept}>초대 수락하고 같이 읽기</J.AcceptButton>
                    <J.CancleButton onClick={() => navigate("/")}>거절</J.CancleButton>
                </J.ButtonWrapper>
            </J.JoinContainer>
        </J.Join>
    );
}

export default Join;
