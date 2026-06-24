import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";


export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(67, 67, 67, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const BookRating = styled.div`
    width: 597px;
    height: 360px;
    padding: 32px;
    background-color: ${colors.white};
    display: flex;
    border-radius: 8px;
    border: 1px solid ${colors.grayMedium};
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

export const CloseIcon = styled.img`
    width: 24px;
    height: 24px;
    align-self: flex-end;
    cursor: pointer;
`;

export const Content = styled.div`
    margin: 48px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
`;

export const Title = styled.div`
    ${typography.Heading};
    font-size: 24px;
`;

export const SubTitle = styled.div`
    ${typography.bodyBase};
`;

export const RatingWrapper = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    height: 32px;
    user-select: none;
`;

export const StarButton = styled.button`
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    line-height: 0;
    font-size: 0;
`;

export const StarImg = styled.img`
    width: 32px;
    height: 32px;
    display: block;
`;

export const RecommendButton = styled.button`
    border: none;
    border-radius: 8px;
    background-color: ${colors.coral};
    color: ${colors.white};
    ${typography.bodyBaseSingle};
    font-size: 14px;
    padding: 0 20px;
    height: 40px;
    cursor: pointer;
    margin-top: 3px;
`;

export const RecommendText = styled.div`
    ${typography.bodyBase};
    color: ${colors.black};
    margin-top: 3px;
`;

export const RecommendTitle = styled.span`
    color: ${colors.coral};
    font-weight: 700;
`;
