import styled from "styled-components";
// import { typography } from "../typography";
// import { colors } from "../colors";

export const TeamList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    margin-top: 48px;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 284px);
    gap: 16px;
`;
