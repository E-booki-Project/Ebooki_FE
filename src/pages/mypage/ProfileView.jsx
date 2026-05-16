import React from "react";
import * as PV from "../../styles/mypage/ProfileViewStyle";
import { getUserInfo } from "../../utils/authStorage";

import edit from "../../assets/images/edit.png";
import defaultUser from "../../assets/images/user_blue.png";
import tape from "../../assets/images/tape_blue.png";

function ProfileView({ onEdit }) {
    const userInfo = getUserInfo();

    return (
        <PV.ProfileView>
            <PV.EditButton onClick={onEdit}>
                <PV.EditIcon src={edit} />
                프로필 수정
            </PV.EditButton>
            <PV.Profile>
                <PV.ProfileIcon src={userInfo?.profileImage || defaultUser} />
                <PV.ProfileName>{userInfo?.nickname ?? "닉네임"}</PV.ProfileName>
            </PV.Profile>
            <PV.Book>
                <PV.BookTape src={tape} />
                <PV.BookContent>
                    제 손으로 직접 소장수에게 판 것이다. 내가 그 아내를 유인해다
                    팔았거나 혹은 내가 복만이를 꼬여서 서로 공모하고 팔아먹은
                    것은 절대로 아니었다.
                </PV.BookContent>
                <PV.BookInfo>책 제목, p.22</PV.BookInfo>
            </PV.Book>
        </PV.ProfileView>
    );
}

export default ProfileView;
