import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as H from "../styles/components/HeaderStyle";
import logo from "../assets/images/logo.png";
import profile from "../assets/images/user_pink.png";

function AppHeader({ isLoggedIn = true, onLogout }) {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const profileRef = useRef(null);

    const handleAuthClick = () => {
        navigate("/signin");
    };

    const handleProfileClick = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleMyPageClick = () => {
        setIsDropdownOpen(false);
        navigate("/mypage");
    };

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);

        if (onLogout) {
            onLogout();
        } else {
            navigate("/");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                    <H.ProfileWrapper ref={profileRef}>
                        <H.ProfileImage
                            src={profile}
                            alt="프로필"
                            onClick={handleProfileClick}
                        />

                        {isDropdownOpen && (
                            <H.Dropdown>
                                <H.DropdownItem onClick={handleLogoutClick}>
                                    로그아웃
                                </H.DropdownItem>
                                <H.DropdownItem onClick={handleMyPageClick}>
                                    마이페이지
                                </H.DropdownItem>
                            </H.Dropdown>
                        )}
                    </H.ProfileWrapper>
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
