import styled from "styled-components";
import { colors } from "../colors";
import { typography } from "../typography";

export const Reader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 90vh;
`;

export const ReaderRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
`;

export const SideSection = styled.div`
    width: 240px;
    flex-shrink: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const CenterSection = styled.div`
    flex: 0 0 auto;
    width: clamp(700px, 55vw, 1050px);
    aspect-ratio: 700 / 516;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 14px;
`;

export const BookFrame = styled.div`
    width: clamp(700px, 55vw, 1050px);
    aspect-ratio: 700 / 516;
    position: relative;
    overflow: hidden;
    z-index: 1;
`;

export const ProgressSection = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 40px;
    box-sizing: border-box;
`;

export const ProgressTrack = styled.div`
    flex: 1;
    height: 4px;
    background-color: ${colors.grayLighter};
    border-radius: 2px;
    cursor: pointer;
    position: relative;
`;

export const ProgressFill = styled.div`
    height: 100%;
    background-color: ${colors.coral};
    border-radius: 2px;
    width: ${({ $percent }) => `${Math.round($percent * 100)}%`};
    transition: width 0.3s ease;
    pointer-events: none;
`;

export const ProgressLabel = styled.div`
    ${typography.bodySmall};
    font-size: 12px;
    color: ${colors.grayDark};
    white-space: nowrap;
    min-width: 36px;
    text-align: right;
`;
