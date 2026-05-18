export const validateEmail = (email) => {
    if (!email.trim()) {
        return "이메일을 입력해주세요.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "올바른 이메일 형식을 입력해주세요.";
    }

    return "";
};

export const validatePassword = (password) => {
    if (!password.trim()) {
        return "비밀번호를 입력해주세요.";
    }

    if (password.length < 8) {
        return "비밀번호는 8자 이상이어야 합니다.";
    }

    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

    if (!passwordRegex.test(password)) {
        return "영문, 숫자, 특수문자를 모두 포함해야 합니다.";
    }

    return "";
};

export const validatePasswordConfirm = (password, passwordConfirm) => {
    if (!passwordConfirm.trim()) {
        return "비밀번호 확인을 입력해주세요.";
    }

    if (password !== passwordConfirm) {
        return "비밀번호가 일치하지 않습니다.";
    }

    return "";
};

export const validateSignupForm = ({ email, password, passwordConfirm }) => {
    return {
        email: validateEmail(email),
        password: validatePassword(password),
        passwordConfirm: validatePasswordConfirm(password, passwordConfirm),
    };
};

// 로그인 폼 검증 함수
export const validateLoginPassword = (password) => {
    if (!password.trim()) {
        return "비밀번호를 입력해주세요.";
    }

    return "";
};

export const validateSigninForm = ({ email, password }) => {
    return {
        email: validateEmail(email),
        password: validateLoginPassword(password),
    };
};
