import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth";
import { setAuthStorage } from "../../utils/authStorage";
import { useUserInfo } from "../../context/useUserInfo";

function GoogleCallback() {
    const navigate = useNavigate();
    const { refreshUserInfo } = useUserInfo();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
            alert("구글 로그인에 실패했습니다.");
            navigate("/signin");
            return;
        }

        const handleGoogleLogin = async () => {
            try {
                const result = await googleLogin(code);
                const { accessToken, refreshToken, userInfoDTO } = result.data;
                setAuthStorage({ accessToken, refreshToken, userInfo: userInfoDTO });
                await refreshUserInfo();
                navigate("/home");
            } catch (error) {
                alert(error.response?.data?.message || "구글 로그인에 실패했습니다.");
                navigate("/signin");
            }
        };

        handleGoogleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default GoogleCallback;
