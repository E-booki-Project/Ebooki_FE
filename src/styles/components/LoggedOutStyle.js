import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const LoggedOut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
`;

export const Section = styled.section`
    background-color: ${colors.grayMedium};
    width: 778px;
    height: 100vh;
    display: flex;
    align-items: end;
    justify-content: center;
    position: relative;
`;

export const StartButton = styled.button`
    width: 275px;
    height: 40px;
    background-color: ${colors.coral};
    border: none;
    border-radius: 8px;
    color: ${colors.white};
    ${typography.bodyBaseSingle};
    position: absolute;
    bottom: 48px;
`;
