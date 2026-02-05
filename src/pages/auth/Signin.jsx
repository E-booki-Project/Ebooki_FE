import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../styles/auth/SigninStyle";

import google from "../../assets/images/google.png";
import naver from "../../assets/images/naver.png";
import kakao from "../../assets/images/kakao.png";

function Signin() {
    const navigate = useNavigate();

    const handlePassword = () => {
        navigate("/forgotpassword");
    };

    return (
        <S.Signin>
            <S.EmailContainer>
                <S.Form>
                    <S.InputWrapper>
                        <S.InputLabel>이메일</S.InputLabel>
                        <S.InputFeild placeholder="booki@example.com" />
                    </S.InputWrapper>
                    <S.InputWrapper>
                        <S.InputLabel>비밀번호</S.InputLabel>
                        <S.InputFeild placeholder="비밀번호를 입력해주세요" />
                    </S.InputWrapper>
                    <S.SigninButton>Sign In</S.SigninButton>
                    <S.ForgotPassword onClick={handlePassword}>
                        비밀번호를 잊어버렸어요 〉
                    </S.ForgotPassword>
                </S.Form>
            </S.EmailContainer>
            <S.SocialContainer>
                <S.Title>소셜 로그인</S.Title>
                <S.IconWrapper>
                    <S.SocailIcon src={google} />
                    <S.SocailIcon src={naver} />
                    <S.SocailIcon src={kakao} />
                </S.IconWrapper>
            </S.SocialContainer>
        </S.Signin>
    );
}

export default Signin;
