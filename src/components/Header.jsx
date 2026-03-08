import React from "react";
import { useNavigate } from "react-router-dom";
import * as H from "../styles/components/HeaderStyle";
import logo from "../assets/images/logo.png";
import profile from "../assets/images/user_pink.png";

function AppHeader({ isLoggedIn = false, onLogout }) {
    const navigate = useNavigate();

    const handleAuthClick = () => {
        if (isLoggedIn) {
            if (onLogout) onLogout();
            else navigate("/");
        } else {
            navigate("/signin");
        }
    };

    const handleProfileClick = () => {
        navigate("/mypage");
    };

    return (
        <H.Header>
            <H.Logo src={logo} alt="logo" onClick={() => navigate("/")} />

            <H.MenuWrapper>
                <H.MenuNav>
                    <H.MenuLink to="/pricing" end>
                        요금제
                    </H.MenuLink>
                    <H.MenuLink to="/books">도서 리스트</H.MenuLink>
                    <H.MenuLink to="/teams">팀</H.MenuLink>
                </H.MenuNav>

                {isLoggedIn ? (
                    <H.ProfileImage
                        src={profile}
                        alt="프로필"
                        onClick={handleProfileClick}
                    />
                ) : (
                    <H.LoginBtn
                        as="button"
                        type="button"
                        onClick={handleAuthClick}
                    >
                        로그인
                    </H.LoginBtn>
                )}
            </H.MenuWrapper>
        </H.Header>
    );
}

export default AppHeader;
