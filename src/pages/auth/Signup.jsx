import React from "react";
import * as S from "../../styles/auth/SignupStyle";

import plus from "../../assets/images/plus.png";
import back from "../../assets/images/back.png";

function signup() {
    return (
        <S.Signup>
            <S.SignupContainer>
                <S.Header>
                    <img src={back} />
                </S.Header>
                <S.Form>
                    <S.Profile>
                        <S.ProfileIcon src={plus} />
                    </S.Profile>
                    <S.InputWrapper>
                        <S.InputLabel>아이디</S.InputLabel>
                        <S.InputFeild placeholder="booki" />
                    </S.InputWrapper>
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
                    <S.SignupButton>가입하기</S.SignupButton>
                </S.Form>
            </S.SignupContainer>
        </S.Signup>
    );
}

export default signup;
