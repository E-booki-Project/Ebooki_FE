import styled, { css } from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const TeamCard = styled.div`
    width: 284px;
    height: 465px;
    background-color: ${colors.white};
    border-radius: 4px;
    padding: 32px 24px;
    box-sizing: border-box;
`;

export const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
`;

export const BookImage = styled.img`
    width: 176px;
    height: 248px;
    object-fit: cover;
`;

export const MenuWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`;

export const MoreIcon = styled.img`
    cursor: pointer;
    width: 20px;
    height: 20px;
`;

export const Dropdown = styled.div`
    position: absolute;
    top: 24px;
    right: 0;
    width: 130px;
    height: 104px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: ${colors.white};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 10;
`;

export const DropdownItem = styled.div`
    width: 100%;

    border: none;
    background: ${colors.white};
    text-align: left;
    cursor: pointer;
    ${typography.bodyBaseSingle};

    &:hover {
        background-color: ${colors.grayLighter};
    }
`;

export const BookInfo = styled.div`
    width: 100%;
`;

export const TeamTitle = styled.div`
    ${typography.Heading};
    font-size: 16px;
    color: ${colors.black};
    margin-bottom: 6px;
`;

export const BookTitle = styled.div`
    ${typography.subHeading};
    font-size: 14px;
    color: ${colors.black};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 8px;
`;

export const RatingRow = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 6px;
`;

export const StarIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const ProgressBarBg = styled.div`
    width: 100%;
    height: 7.61px;
    border-radius: 999px;
    background-color: ${colors.grayLighter};
    overflow: hidden;
    margin-bottom: 12px;
`;

export const ProgressBarFill = styled.div`
    width: ${({ $progress }) => `${$progress}%`};
    height: 100%;
    border-radius: 999px;
    background-color: ${colors.coral};
`;

export const MemberList = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

export const Member = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    box-sizing: border-box;

    ${({ $isDefault, $borderColor }) =>
        !$isDefault &&
        css`
            border: 2px solid ${$borderColor || colors.coral};
        `}
`;
