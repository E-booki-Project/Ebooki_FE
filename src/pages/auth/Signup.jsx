import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../../styles/auth/SignupStyle";
import { signup } from "../../api/auth";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateSignupForm,
} from "../../utils/authValidation";

import plus from "../../assets/images/plus.png";
import back from "../../assets/images/back.png";

function Signup() {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [profileImg, setProfileImg] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [form, setForm] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("선택된 파일:", file);

        setSelectedFile(file);

        const imageUrl = URL.createObjectURL(file);
        setProfileImg(imageUrl);
    };

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
            errorMessage = validatePassword(value);
        }

        if (name === "passwordConfirm") {
            errorMessage = validatePasswordConfirm(nextForm.password, value);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
            ...(name === "password"
                ? {
                      passwordConfirm: nextForm.passwordConfirm
                          ? validatePasswordConfirm(
                                value,
                                nextForm.passwordConfirm,
                            )
                          : "",
                  }
                : {}),
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        let errorMessage = "";

        if (name === "email") {
            errorMessage = validateEmail(value);
        }

        if (name === "password") {
            errorMessage = validatePassword(value);
        }

        if (name === "passwordConfirm") {
            errorMessage = validatePasswordConfirm(form.password, value);
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("현재 form 상태:", form);
        console.log("선택된 파일:", selectedFile);

        const validationErrors = validateSignupForm({
            email: form.email,
            password: form.password,
            passwordConfirm: form.passwordConfirm,
        });

        setErrors(validationErrors);

        const hasError = Object.values(validationErrors).some((value) => value);
        if (hasError) return;

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("email", form.email);
            formData.append("password", form.password);

            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }

            for (const [key, value] of formData.entries()) {
                console.log("formData:", key, value);
            }

            const result = await signup(formData);
            console.log("회원가입 응답:", result);

            if (result.statusCode === 200) {
                alert(result.message || "회원가입이 완료되었습니다.");
                navigate("/signin");
            } else {
                alert(result.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.log("회원가입 에러:", error);

            const message =
                error.response?.data?.message ||
                "서버 오류가 발생했습니다. 다시 시도해주세요.";

            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <S.Signup>
            <S.SignupContainer>
                <S.Header>
                    <img src={back} alt="뒤로가기" onClick={handleBack} />
                </S.Header>

                <S.Form onSubmit={handleSubmit}>
                    <S.Profile type="button" onClick={handleProfileClick}>
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
                        <S.InputFeild
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
                        <S.InputFeild
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        />
                        {errors.password && (
                            <S.ErrorMessage>{errors.password}</S.ErrorMessage>
                        )}
                    </S.InputWrapper>

                    <S.InputWrapper>
                        <S.InputLabel>비밀번호 확인</S.InputLabel>
                        <S.InputFeild
                            type="password"
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                        />
                        {errors.passwordConfirm && (
                            <S.ErrorMessage>
                                {errors.passwordConfirm}
                            </S.ErrorMessage>
                        )}
                    </S.InputWrapper>

                    <S.SignupButton type="submit" disabled={isLoading}>
                        {isLoading ? "가입 중..." : "가입하기"}
                    </S.SignupButton>
                </S.Form>
            </S.SignupContainer>
        </S.Signup>
    );
}

export default Signup;
