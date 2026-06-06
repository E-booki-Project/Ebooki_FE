import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLogin } from "../../api/auth";
import { setAuthStorage } from "../../utils/authStorage";
import { useUserInfo } from "../../context/useUserInfo";

function KakaoCallback() {
    const navigate = useNavigate();
    const { refreshUserInfo } = useUserInfo();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
            alert("카카오 로그인에 실패했습니다.");
            navigate("/signin");
            return;
        }

        const handleKakaoLogin = async () => {
            try {
                const result = await kakaoLogin(code);
                const { accessToken, refreshToken, userInfoDTO } = result.data;
                setAuthStorage({ accessToken, refreshToken, userInfo: userInfoDTO });
                await refreshUserInfo();
                navigate("/home");
            } catch (error) {
                alert(error.response?.data?.message || "카카오 로그인에 실패했습니다.");
                navigate("/signin");
            }
        };

        handleKakaoLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default KakaoCallback;
