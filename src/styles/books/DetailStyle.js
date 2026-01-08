import styled from "styled-components";
import { colors } from "../colors";
import { typography } from "../typography";

export const Detail = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    min-height: 100vh;
`;

export const LeftPanel = styled.div`
    display: flex;
    justify-content: center;
    margin-right: 64px;
`;

export const CoverWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 461px;
    height: 680px;
`;

export const CoverImage = styled.img`
    width: 100%;
    display: block;
    border-radius: 0 0 140px 0;
`;

export const PreviewButton = styled.button`
    position: absolute;
    bottom: 24px;

    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background-color: ${colors.white};
    ${typography.bodyBaseSingle};
    cursor: pointer;
`;

export const CoverActions = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 13px;
    z-index: 5;
    top: 54px;
    right: -50px;
`;

export const ActionButton = styled.button`
    width: 50px;
    height: 40px;
    border: none;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ $variant }) =>
        $variant === "bookmark" ? "#F2CF66" : "#F2949C"};
`;

export const ActionIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const RightPanel = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 77px;
`;

export const BookInfoSection = styled.section`
    margin-bottom: 32px;
    margin-left: 35px;
`;

export const BookTitle = styled.div`
    ${typography.Heading};
    margin-bottom: 62px;
`;

export const BookMeta = styled.div`
    ${typography.subHeading};
    color: ${colors.black};
    margin-bottom: 8px;
`;

export const RatingWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 16px;
`;

export const StarIcon = styled.img`
    width: 32px;
    height: 32px;
`;

export const RatingScore = styled.div`
    margin-left: 16px;
    ${typography.subHeading};
`;

export const ReadButton = styled.div`
    width: 139px;
    height: 40px;
    background-color: ${colors.coral};
    border: none;
    border-radius: 8px;
    color: ${colors.white};
    ${typography.bodyBaseSingle};
    padding: 12px;
    margin-top: 32px;
`;

export const NoteSection = styled.section`
    margin-top: 142px;
`;

export const NoteHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 35px;
    margin-bottom: 24px;
`;
export const NoteTitle = styled.div`
    ${typography.subHeading};
`;

export const SortTabs = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

export const TabButton = styled.button`
    border: none;
    text-align: center;
    margin: 0 6px;
    ${typography.bodyBaseSingle};
    font-size: 14px;
    cursor: pointer;
    color: ${({ $active }) => ($active ? colors.black : colors.grayDark)};
`;

export const NoteList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
`;

export const NoteCard = styled.div`
    display: flex;
    background-color: ${colors.white};
    padding: 24px;
    border-radius: 8px;
    border: solid 1px ${colors.grayMedium};
    width: 516px;
    justify-content: center;
    align-items: center;
    margin-left: 35px;
    display: block;
`;

export const NoteLeftBar = styled.div`
    width: 52px;
    height: 24px;
    background-color: ${colors.blue};
    opacity: 50%;
    position: absolute;
    left: 0px;
`;

export const NoteContent = styled.div`
    display: flex;
    flex-direction: column;
`;

export const NoteText = styled.div`
    ${typography.bodySmall};
    white-space: pre-wrap;
    color: ${colors.black};
`;

export const NoteFooter = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    width: 100%;
`;

export const NotePage = styled.div`
    ${typography.bodySmall};
`;

export const NoteDate = styled.div`
    ${typography.bodySmall};
`;
