import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const Page = styled.div`
    position: relative;
    height: calc(100vh - 64px);
    overflow: hidden;
`;

export const MapSection = styled.div`
    position: absolute;
    inset: 0;
`;

export const MapContainer = styled.div`
    width: 100%;
    height: 100%;
`;

/* 추천 도서 패널 */
export const RecommendPanel = styled.div`
    position: absolute;
    bottom: 40px;
    left: 40px;
    width: 460px;
    background: ${colors.white};
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    padding: 20px;
    z-index: 10;
`;

export const PanelTitle = styled.div`
    ${typography.bodyStrong};
    margin-bottom: 14px;
`;

export const BookList = styled.div`
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 4px;

    &::-webkit-scrollbar {
        height: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.grayMedium};
        border-radius: 2px;
    }
`;

export const BookCard = styled.div`
    flex-shrink: 0;
    width: 110px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    cursor: pointer;
    border-radius: 8px;
    padding: 6px;
    outline: ${({ $selected }) => ($selected ? `2px solid ${colors.coral}` : "none")};
    transition: outline 0.15s;

    &:hover {
        opacity: 0.85;
    }
`;

export const BookCover = styled.img`
    width: 98px;
    height: 143px;
    object-fit: cover;
    border-radius: 4px;
    background-color: ${colors.grayMedium};
`;

export const BookTitle = styled.div`
    ${typography.bodySmall};
    font-weight: 600;
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-width: 98px;
`;

export const BookAuthor = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 98px;
`;

/* 도서관 목록 패널 */
export const LibraryPanel = styled.div`
    position: absolute;
    top: 40px;
    right: 40px;
    bottom: 40px;
    width: 320px;
    background: ${colors.white};
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    z-index: 10;
`;

export const LibraryList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.grayMedium};
        border-radius: 2px;
    }
`;

export const LibraryItem = styled.div`
    padding: 16px 24px;
    border-bottom: 1px solid ${colors.grayLighter};
    cursor: pointer;
    background-color: ${({ $selected }) => ($selected ? "rgba(255, 107, 107, 0.08)" : "transparent")};
    box-shadow: ${({ $selected }) => ($selected ? `inset 3px 0 0 ${colors.coral}` : "none")};
    transition: background-color 0.15s;

    &:hover {
        background-color: ${({ $selected }) => ($selected ? "rgba(255, 107, 107, 0.12)" : colors.grayLighter)};
    }
`;

export const LibraryName = styled.div`
    ${typography.bodyStrong};
    margin-bottom: 4px;
`;

export const LibraryAddress = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
`;

/* 페이지네이션 */
export const Pagination = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px;
    border-top: 1px solid ${colors.grayMedium};
    flex-shrink: 0;
`;

export const PageButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid ${({ $active }) => ($active ? colors.coral : colors.grayMedium)};
    background-color: ${({ $active }) => ($active ? colors.coral : colors.white)};
    color: ${({ $active }) => ($active ? colors.white : colors.black)};
    ${typography.bodySmall};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border-color: ${colors.coral};
        color: ${({ $active }) => ($active ? colors.white : colors.coral)};
    }
`;

export const Ellipsis = styled.span`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    padding: 0 2px;
`;
