import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

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

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: ${colors.grayDark};
    ${typography.bodyBase};
    height: 70vh;
    justify-content: center;
`;

export const EmptyStateButton = styled.button`
    border: none;
    border-radius: 8px;
    background-color: ${colors.coral};
    color: ${colors.white};
    ${typography.bodyBaseSingle};
    font-size: 14px;
    padding: 10px 24px;
    cursor: pointer;
`;
