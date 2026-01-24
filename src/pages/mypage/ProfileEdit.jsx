import React, { useRef, useState, useEffect } from "react";
import * as PE from "../../styles/mypage/ProfileEditStyle";

import plus from "../../assets/images/plus_gray.png";
import user from "../../assets/images/user_blue.png";

function ProfileEdit() {
    const fileRef = useRef(null);

    const [previewUrl, setPreviewUrl] = useState(user);
    const [profileImage, setProfileImage] = useState(null);

    const handlePickImage = () => {
        fileRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const editfd = new FormData();
        if (profileImage) editfd.append("profileImage", profileImage);
        console.log("profileImage:", profileImage);
        console.log([...editfd.entries()]);
    };

    return (
        <PE.ProfileEdit>
            <PE.ProfileWrapper type="button" onClick={handlePickImage}>
                <PE.ProfileImg src={previewUrl} />
                <PE.ProfileIcon src={plus} />
            </PE.ProfileWrapper>
            <PE.ProfileInput
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleImageChange}
            />
            <PE.AccountSettings>
                <PE.Form onSubmit={handleSubmit}>
                    <PE.InputWrapper>
                        <PE.InputLabel>이메일</PE.InputLabel>
                        <PE.InputFeild
                            readOnly
                            value="booki@example.com"
                            style={{ border: "none", padding: "16px 0px" }}
                        />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>닉네임</PE.InputLabel>
                        <PE.InputFeild placeholder="ebooki" />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>비밀번호</PE.InputLabel>
                        <PE.InputFeild placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
                    </PE.InputWrapper>
                    <PE.InputWrapper>
                        <PE.InputLabel>비밀번호 확인</PE.InputLabel>
                        <PE.InputFeild placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
                    </PE.InputWrapper>
                    <PE.EditButton type="submit">수정 완료</PE.EditButton>
                </PE.Form>
                <PE.WithdrawButton type="button">회원 탈퇴</PE.WithdrawButton>
            </PE.AccountSettings>
        </PE.ProfileEdit>
    );
}

export default ProfileEdit;
