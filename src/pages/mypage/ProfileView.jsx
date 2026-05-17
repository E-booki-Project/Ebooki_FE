import React from "react";
import * as PV from "../../styles/mypage/ProfileViewStyle";
import { getUserInfo } from "../../utils/authStorage";

import edit from "../../assets/images/edit.png";
import defaultUser from "../../assets/images/user_blue.png";
import tape from "../../assets/images/tape_blue.png";

function ProfileView({ onEdit, highlight }) {
    const userInfo = getUserInfo();

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
                <PV.BookTape src={tape} />
                <PV.BookContent>
                    {highlight?.text ?? "하이라이트가 없습니다."}
                </PV.BookContent>
                {highlight && (
                    <PV.BookInfo>
                        {`${highlight.bookTitle}${highlight.page ? `, p.${highlight.page}` : ""}`}
                    </PV.BookInfo>
                )}
            </PV.Book>
        </PV.ProfileView>
    );
}

export default ProfileView;
