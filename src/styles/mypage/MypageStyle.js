import styled from "styled-components";
import { colors } from "../colors";

export const Mypage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
`;

export const Layout = styled.div`
    width: 1050px;
    height: 774px;
    display: flex;
    flex-direction: row;
`;

export const Section = styled.section`
    display: flex;
    align-items: start;
    justify-content: center;
    width: 50%;
    height: 100%;
    background-color: ${colors.white};
    border: 1px solid ${colors.black};
    overflow: hidden;

    &:last-child {
        border-left: none;
    }
`;

export const RightContent = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
`;
