import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../styles/auth/SigninStyle";
import { login } from "../../api/auth";
import { setAuthStorage } from "../../utils/authStorage";
import { useUserInfo } from "../../context/useUserInfo";
import {
    validateEmail,
    validateLoginPassword,
    validateSigninForm,
} from "../../utils/authValidation";

import google from "../../assets/images/google.png";
import naver from "../../assets/images/naver.png";
import kakao from "../../assets/images/kakao.png";

function Signin() {
    const navigate = useNavigate();
    const { refreshUserInfo } = useUserInfo();

    const handlePassword = () => {
        // navigate("/forgotpassword");
        navigate("/signup");
    };

    const handleKakaoLogin = () => {
        const key = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${key}&redirect_uri=${redirectUri}&response_type=code`;
    };

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const nextForm = {
            ...form,
            [name]: value,
        };

        setForm(nextForm);

        let errorMessage = "";

        if (name === "email") {
            errorMessage = validateEmail(value);
        }

        if (name === "password") {
            errorMessage = validateLoginPassword(value);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        let errorMessage = "";

        if (name === "email") {
            errorMessage = validateEmail(value);
        }

        if (name === "password") {
            errorMessage = validateLoginPassword(value);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateSigninForm({
            email: form.email,
            password: form.password,
        });

        setErrors(validationErrors);

        const hasError = Object.values(validationErrors).some((value) => value);
        if (hasError) return;

        setIsLoading(true);

        try {
            const result = await login({
                email: form.email,
                password: form.password,
            });

            if (result.statusCode === 200) {
                const { accessToken, refreshToken, userInfoDTO } = result.data;

                setAuthStorage({
                    accessToken,
                    refreshToken,
                    userInfo: userInfoDTO,
                });
                await refreshUserInfo();

                navigate("/home");
            } else {
                alert(result.message || "로그인에 실패했습니다.");
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "서버 오류가 발생했습니다. 다시 시도해주세요.";

            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <S.Signin>
            <S.EmailContainer>
                <S.Form onSubmit={handleSubmit}>
                    <S.InputWrapper>
                        <S.InputLabel>이메일</S.InputLabel>
                        <S.InputField
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="booki@example.com"
                        />
                        {errors.email && (
                            <S.ErrorMessage>{errors.email}</S.ErrorMessage>
                        )}
                    </S.InputWrapper>

                    <S.InputWrapper>
                        <S.InputLabel>비밀번호</S.InputLabel>
                        <S.InputField
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="비밀번호를 입력해주세요"
                        />
                        {errors.password && (
                            <S.ErrorMessage>{errors.password}</S.ErrorMessage>
                        )}
                    </S.InputWrapper>

                    <S.SigninButton type="submit" disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "Sign In"}
                    </S.SigninButton>

                    <S.ForgotPassword onClick={handlePassword}>
                        회원가입 〉
                    </S.ForgotPassword>
                </S.Form>
            </S.EmailContainer>

            <S.SocialContainer>
                <S.Title>소셜 로그인</S.Title>
                <S.IconWrapper>
                    <S.SocialIcon src={google} alt="google" />
                    <S.SocialIcon src={naver} alt="naver" />
                    <S.SocialIcon src={kakao} alt="kakao" onClick={handleKakaoLogin} style={{ cursor: "pointer" }} />
                </S.IconWrapper>
            </S.SocialContainer>
        </S.Signin>
    );
}

export default Signin;
