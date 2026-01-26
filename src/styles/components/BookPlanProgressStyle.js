import styled, { css } from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

const getSegmentWidth = (segmentCount) => {
    switch (segmentCount) {
        case 3:
            return "calc((100% - 8px) / 3)";
        case 7:
            return "calc((100% - 24px) / 7)";
        case 12:
            return "calc((100% - 44px) / 12)";
        default:
            return `calc((100% - ${(segmentCount - 1) * 4}px) / ${segmentCount})`;
    }
};

export const BookPlanProgress = styled.div`
    background-color: ${colors.grayLighter};
    border: 2px solid ${colors.grayMedium};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    width: 453px;
    height: 233px;
    margin-top: 56px;
`;

export const ProgressCard = styled.div`
    background-color: ${colors.white};
    border-bottom: 2px solid ${colors.grayMedium};
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    height: 192px;
    width: 100%;
    padding: 24px;
`;

export const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 52px;
`;

export const PlanTitle = styled.div`
    ${typography.bodyBase};
    font-size: 14px;
    color: ${colors.grayDark};
`;

export const PlanIcon = styled.img`
    height: 16px;
    width: 16px;
    cursor: pointer;
`;

export const ProgressContainer = styled.div`
    width: 100%;
`;

export const ProgressTitle = styled.div`
    ${typography.bodyStrong};
    font-size: 24px;
    margin-bottom: 12px;
`;

export const ProgressBarWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 4px;
`;

export const ProgressSegment = styled.div`
    height: 26px;
    border-radius: 4px;
    flex-shrink: 0;
    width: ${({ $segmentCount }) => getSegmentWidth($segmentCount)};
    background-color: ${colors.grayLighter};

    ${({ $isActive }) =>
        $isActive &&
        css`
            background-color: #ee8f9b;
        `}
`;

export const Footer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding: 12px 24px;
`;

export const PlanText = styled.div`
    ${typography.subHeading};
    font-size: 14px;
    color: ${colors.grayDark};
    display: flex;
    align-items: center;
    gap: 6px;
`;
