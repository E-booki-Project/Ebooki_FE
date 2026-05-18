import React from "react";
import * as PV from "../../styles/mypage/ProfileViewStyle";
import { useUserInfo } from "../../context/UserContext";

import edit from "../../assets/images/edit.png";
import defaultUser from "../../assets/images/user_pink.png";
import tape_blue from "../../assets/images/tape_blue.png";
import tape_green from "../../assets/images/tape_green.png";
import tape_pink from "../../assets/images/tape_pink.png";
import tape_yellow from "../../assets/images/tape_yellow.png";

const TAPE_MAP = {
    BLUE: tape_blue,
    GREEN: tape_green,
    PINK: tape_pink,
    YELLOW: tape_yellow,
};

const HIGHLIGHT_COLOR_MAP = {
    BLUE: "rgba(137, 209, 217, 0.30)",
    GREEN: "rgba(205, 242, 167, 0.30)",
    PINK: "rgba(242, 148, 156, 0.30)",
    YELLOW: "rgba(242, 207, 102, 0.30)",
};

function ProfileView({ onEdit, highlight }) {
    const { userInfo } = useUserInfo();
    const tapeImage = TAPE_MAP[highlight?.userColor] ?? tape_blue;
    const highlightColor = HIGHLIGHT_COLOR_MAP[highlight?.userColor] ?? HIGHLIGHT_COLOR_MAP.BLUE;

    return (
        <PV.ProfileView>
            <PV.EditButton onClick={onEdit}>
                <PV.EditIcon src={edit} />
                프로필 수정
            </PV.EditButton>
            <PV.Profile>
                <PV.ProfileIcon
                    src={userInfo?.profileImage || defaultUser}
                    onError={(e) => { e.currentTarget.src = defaultUser; }}
                />
                <PV.ProfileName>{userInfo?.nickname ?? "닉네임"}</PV.ProfileName>
            </PV.Profile>
            <PV.Book>
                <PV.BookTape src={tapeImage} />
                <PV.BookContent $color={highlightColor}>
                    {highlight?.text ?? "하이라이트가 없습니다."}
                </PV.BookContent>
                {highlight && (
                    <PV.BookInfo>{highlight.bookTitle}</PV.BookInfo>
                )}
            </PV.Book>
        </PV.ProfileView>
    );
}

export default ProfileView;
