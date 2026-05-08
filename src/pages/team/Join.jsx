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
import { isLoggedIn } from "../../utils/authStorage";

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

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const response = await joinTeam(token);
                setTeamData(response.teamData.teamData);
                setTeamUserData(response.teamData.teamUserData);
                setBookData(response.bookData);
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
                            : "가을, 김유정"}
                    </J.BookDesc>
                </J.BookWrapper>
                <J.GroupContainer>
                    <J.Group>
                        {teamUserData.map((user) => (
                            <J.Profile
                                key={user.id}
                                src={COLOR_IMAGE_MAP[user.userColor] || userPink}
                            />
                        ))}
                    </J.Group>
                    <J.Plus src={Plus} />
                    <J.JoinProfile src={userYellow} />
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
