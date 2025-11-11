import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const LoggedIn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
`;

export const Banner = styled.div`
    background-color: ${colors.grayMedium};
    width: 778px;
    height: 310px;
    position: relative;
    margin-top: 48px;
    margin-bottom: 32px;
`;

export const BannerButton = styled.button`
    position: absolute;
    width: 160px;
    height: 40px;
    background-color: ${colors.coral};
    border: none;
    border-radius: 8px;
    color: ${colors.white};
    ${typography.bodyBaseSingle};
    position: absolute;
    bottom: 27px;
    right: 27px;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 778px;
    gap: 32px;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
`;

export const listTitle = styled.div`
    text-align: start;
    ${typography.bodyBase};
    margin-top: 0;
`;

export const BookGrid = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 4px 12px;
    margin-top: 16px;

    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export const BookItem = styled.div`
    flex: 0 0 150px;
    display: flex;
    flex-direction: column;
    align-items: start;
    scroll-snap-align: start;
`;

export const BookCover = styled.img`
    width: 146px;
    height: 215px;
    object-fit: cover;
`;

export const BookTitle = styled.div`
    margin-top: 8px;
    ${typography.bodySmall};
`;

export const RatingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const RatingIcon = styled.img`
    width: 18px;
    height: 18px;
    margin-right: 8px;
`;

export const BookRating = styled.div`
    ${typography.bodySmall};
    line-height: 120%;
    margin-top: 2px;
`;
