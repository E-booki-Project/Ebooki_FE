import React from "react";
import * as F from "../../styles/auth/ForgotPasswordStyle";

import back from "../../assets/images/back.png";

function ForgotPassword() {
    return (
        <F.ForgotPassword>
            <F.PasswordContainer>
                <F.Header>
                    <img src={back} />
                </F.Header>
                <F.Form>
                    <F.InputWrapper>
                        <F.InputLabel>이메일</F.InputLabel>
                        <F.InputFeild placeholder="booki@example.com" />
                    </F.InputWrapper>
                    <F.InputWrapper>
                        <F.InputLabel>새 비밀번호</F.InputLabel>
                        <F.InputFeild placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
                    </F.InputWrapper>
                    <F.InputWrapper>
                        <F.InputLabel>비밀번호 확인</F.InputLabel>
                        <F.InputFeild placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
                    </F.InputWrapper>
                    <F.PasswordButton>비밀번호 변경하기</F.PasswordButton>
                </F.Form>
            </F.PasswordContainer>
        </F.ForgotPassword>
    );
}

export default ForgotPassword;
