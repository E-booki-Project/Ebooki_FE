import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

import starEmptyImg from "../../assets/images/star.png";
import starFullImg from "../../assets/images/star_full.png";

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

    display: flex;
    align-items: center;
    justify-content: center;
`;

const StarBase = styled.div`
    width: 32px;
    height: 32px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
`;

export const StarEmpty = styled(StarBase)`
    background-image: url(${starEmptyImg});
`;

export const StarFull = styled(StarBase)`
    background-image: url(${starFullImg});
`;
