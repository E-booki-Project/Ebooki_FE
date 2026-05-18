import styled from "styled-components";
import { colors } from "../colors";
import { typography } from "../typography";

export const Container = styled.div`
    padding: 0 24px 24px;
    width: 100%;
    box-sizing: border-box;
`;

export const SectionLabel = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    margin-bottom: 12px;
`;

export const BookItem = styled.div`
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.grayMedium};

    &:last-child {
        border-bottom: none;
    }
`;

export const BookCover = styled.img`
    width: 44px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
`;

export const BookInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
`;

export const BookTitle = styled.div`
    ${typography.bodyBaseSingle};
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const TeamName = styled.div`
    font-size: 12px;
    color: ${colors.grayDark};
`;

export const ProgressWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const ProgressBar = styled.div`
    flex: 1;
    height: 6px;
    background-color: ${colors.grayMedium};
    border-radius: 4px;
    overflow: hidden;
`;

export const ProgressFill = styled.div`
    height: 100%;
    width: ${({ $percent }) => $percent}%;
    background-color: ${colors.coral};
    border-radius: 4px;
`;

export const ProgressText = styled.div`
    font-size: 12px;
    color: ${colors.grayDark};
    white-space: nowrap;
`;
