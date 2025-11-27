import styled from "styled-components";
import { typography } from "../typography";

export const List = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
`;

export const BookGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: 32px;
    column-gap: 12px;
    justify-items: center;
`;

export const BookItem = styled.div`
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: start;
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
