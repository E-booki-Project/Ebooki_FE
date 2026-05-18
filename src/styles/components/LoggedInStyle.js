import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";
import homeBg from "../../assets/images/home_bg.svg";

export const LoggedIn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
`;

export const Banner = styled.div`
    background-image: url(${homeBg});
    background-size: cover;
    background-position: center;
    width: 778px;
    height: 310px;
    position: relative;
    margin-top: 48px;
    margin-bottom: 32px;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: self-start;
    justify-content: center;
    flex-direction: column;
`;

export const BannerTextGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 50px 40px 0;
    max-width: 60%;
`;

export const BannerTitle = styled.h2`
    margin: 0;
    font-size: 22px;
    line-height: 130%;
    font-weight: 700;
    color: ${colors.black};
    white-space: nowrap;
`;

export const BannerDesc = styled.p`
    margin: 0;
    ${typography.bodySmall};
    color: ${colors.charcoal};
    line-height: 160%;
    font-size: 12px;
`;

export const BannerButton = styled.button`
    padding: 13px 45px;
    font-size: 16px;
    background-color: ${colors.coral};
    border: none;
    border-radius: 8px;
    color: ${colors.white};
    ${typography.bodyBaseSingle};
    cursor: pointer;
    margin: 40px 40px 0;

    &:hover {
        opacity: 0.9;
    }
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 778px;
    gap: 32px;
    padding-bottom: 48px;
`;

export const BookSection = styled.div`
    display: flex;
    flex-direction: column;
`;

export const SectionTitle = styled.div`
    text-align: start;
    ${typography.bodyStrong};
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
    cursor: pointer;
`;

export const BookCover = styled.img`
    width: 146px;
    height: 215px;
    object-fit: cover;
    border-radius: 4px;
`;

export const BookItemTitle = styled.div`
    margin-top: 8px;
    ${typography.bodySmall};
    width: 146px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
