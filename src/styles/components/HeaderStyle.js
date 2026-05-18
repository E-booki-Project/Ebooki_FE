import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { typography } from "../typography";
import { colors } from "../colors";

export const Header = styled.div`
    width: 100%;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${colors.white};
    padding: 32px;
`;

export const Logo = styled.img`
    width: 99px;
    height: auto;
    cursor: pointer;
`;

export const MenuWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const MenuNav = styled.div`
    display: flex;
    align-items: center;
`;

export const Menu = styled.div``;

export const MenuLink = styled(NavLink)`
    ${typography.bodyBaseSingle};
    color: ${colors.grayDark};
    text-decoration: none;
    padding: 8px;
    border-radius: 8px;

    &.active {
        background: ${colors.grayLighter};
        color: ${colors.black};
    }
`;

export const LoginBtn = styled.div`
    ${typography.bodyBaseSingle};
    height: 32px;
    padding: 8px 18.5px;
    border-radius: 8px;
    background: ${colors.coral};
    color: ${colors.white};
    cursor: pointer;
    border: none;
    margin-left: 24px;

    &:hover {
        opacity: 0.9;
    }
`;

export const ProfileWrapper = styled.div`
    position: relative;
    margin-left: 24px;
`;

export const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;

export const Dropdown = styled.div`
    position: absolute;
    top: 52px;
    right: 0;
    width: 130px;
    height: 104px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: ${colors.white};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 10;
`;

export const DropdownItem = styled.div`
    width: 100%;
    border: none;
    background: ${colors.white};
    text-align: left;
    cursor: pointer;
    ${typography.bodyBaseSingle};

    &:hover {
        background-color: ${colors.grayLighter};
    }
`;
