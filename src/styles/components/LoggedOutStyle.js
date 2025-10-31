import styled from "styled-components";
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
    height: 100%;
`;
