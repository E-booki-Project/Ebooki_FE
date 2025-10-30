import React from "react";
import * as J from "../../styles/team/JoinStyle";

import book from "../../assets/images/book.png";
import Plus from "../../assets/images/plus.png";
import userPink from "../../assets/images/user_pink.png";
import userBlue from "../../assets/images/user_blue.png";
import userGreen from "../../assets/images/user_green.png";
import userYellow from "../../assets/images/user_yellow.png";

function Join() {
    return (
        <J.Join>
            <J.JoinContainer>
                <J.BookWrapper>
                    <J.Book src={book} />
                    <J.BookDesc>가을, 김유정</J.BookDesc>
                </J.BookWrapper>
                <J.GroupContainer>
                    <J.Group>
                        <J.Profile src={userPink} />
                        <J.Profile src={userBlue} />
                        <J.Profile src={userGreen} />
                    </J.Group>
                    <J.Plus src={Plus} />
                    <J.JoinProfile src={userYellow} />
                </J.GroupContainer>
                <J.JoinContent></J.JoinContent>
                <J.ButtonWrapper>
                    <J.AcceptButton>초대 수락하고 같이 읽기</J.AcceptButton>
                    <J.CancleButton>거절</J.CancleButton>
                </J.ButtonWrapper>
            </J.JoinContainer>
        </J.Join>
    );
}

export default Join;
