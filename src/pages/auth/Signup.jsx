import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../styles/auth/SignupStyle";

import plus from "../../assets/images/plus.png";
import back from "../../assets/images/back.png";

function Signup() {
    const fileInputRef = useRef(null);
    const [profileImg, setProfileImg] = useState(null);

    const navigate = useNavigate();

    const handleSignin = () => {
        navigate("/signin");
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imgUrl = URL.createObjectURL(file);
        setProfileImg(imgUrl);
    };

    return (
        <S.Signup>
            <S.SignupContainer>
                <S.Header>
                    <img src={back} onClick={handleBack} />
                </S.Header>
                <S.Form>
                    <S.Profile onClick={handleProfileClick}>
                        {profileImg ? (
                            <S.ProfileImg src={profileImg} alt="profile" />
                        ) : (
                            <S.ProfileIcon src={plus} alt="plus" />
                        )}
                    </S.Profile>
                    <S.ProfileInput
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleProfileChange}
                    />
                    <S.InputWrapper>
                        <S.InputLabel>이메일</S.InputLabel>
                        <S.InputFeild placeholder="booki@example.com" />
                    </S.InputWrapper>
                    <S.InputWrapper>
                        <S.InputLabel>비밀번호</S.InputLabel>
                        <S.InputFeild placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
                    </S.InputWrapper>
                    <S.InputWrapper>
                        <S.InputLabel>비밀번호 확인</S.InputLabel>
                        <S.InputFeild placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
                    </S.InputWrapper>
                    <S.SignupButton onClick={handleSignin}>
                        가입하기
                    </S.SignupButton>
                </S.Form>
            </S.SignupContainer>
        </S.Signup>
    );
}

export default Signup;
