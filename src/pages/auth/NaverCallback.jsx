import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { naverLogin } from "../../api/auth";
import { setAuthStorage } from "../../utils/authStorage";
import { useUserInfo } from "../../context/useUserInfo";

function NaverCallback() {
    const navigate = useNavigate();
    const { refreshUserInfo } = useUserInfo();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");

        if (!code) {
            alert("네이버 로그인에 실패했습니다.");
            navigate("/signin");
            return;
        }

        const handleNaverLogin = async () => {
            try {
                const result = await naverLogin(code, state);
                const { accessToken, refreshToken, userInfoDTO } = result.data;
                setAuthStorage({ accessToken, refreshToken, userInfo: userInfoDTO });
                await refreshUserInfo();
                navigate("/home");
            } catch (error) {
                alert(error.response?.data?.message || "네이버 로그인에 실패했습니다.");
                navigate("/signin");
            }
        };

        handleNaverLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default NaverCallback;
