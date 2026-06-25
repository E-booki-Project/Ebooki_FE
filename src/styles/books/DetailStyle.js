import styled from "styled-components";
import { colors } from "../colors";
import { typography } from "../typography";

export const Detail = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    min-height: 90vh;
    position: relative;
`;

export const Toast = styled.div`
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${colors.grayDark};
    color: ${colors.white};
    ${typography.bodyBaseSingle}
    font-size: 14px;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 9999;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    height: 100%;
    display: block;
    object-fit: cover;
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

export const InfoPanel = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 77px;
`;

export const NotePanel = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 77px;
    margin-left: auto;
    margin-right: 160px;
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
    margin-top: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

export const NoteSection = styled.section`
    margin-top: 120px;
    margin-bottom: 16px;
`;

export const NoteHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 35px;
    margin-bottom: 24px;
    width: 512px;
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
    background-color: ${colors.white};
    padding: 20px 24px;
    border-radius: 8px;
    border: solid 1px ${colors.grayMedium};
    width: 516px;
    margin-left: 35px;
    position: relative;
`;

export const NoteHighlight = styled.img`
    display: block;
    width: fit-content;
    position: absolute;
    left: -38px;
    top: 24px;
    z-index: 100;
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

export const AiTopicList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const AiTopicCard = styled.div`
    position: relative;
    background-color: ${colors.white};
    padding: 20px 24px;
    border-radius: 8px;
    border: solid 1px ${colors.grayMedium};
    width: 516px;
    margin-left: 35px;
    cursor: pointer;
`;

export const AiTopicBadge = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 100px;
    background-color: ${colors.blue};
    color: ${colors.white};
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 10px;
`;

export const AiTopicQuestion = styled.div`
    ${typography.bodyBase};
    font-size: 15px;
    font-weight: 600;
    color: ${colors.black};
    white-space: pre-wrap;
    margin-bottom: 16px;
`;

export const AiIntro = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    margin-left: 35px;
    width: 516px;
`;

export const AiCommentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 16px;
    margin-bottom: 16px;
    border-top: 1px solid ${colors.grayLighter};
`;

export const AiCommentItem = styled.div`
    display: flex;
    flex-direction: column;
`;

export const AiCommentProfile = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
`;

export const AiCommentProfileIcon = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
`;

export const AiCommentAuthor = styled.div`
    ${typography.bodyStrong};
    font-size: 13px;
    color: ${colors.black};
`;

export const AiCommentText = styled.div`
    ${typography.bodySmall};
    font-size: 13px;
    white-space: pre-wrap;
    color: ${colors.black};
    padding: 9px;
`;

export const AiInputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    background-color: ${colors.grayLighter};
    border-radius: 8px;
    min-height: 36px;
    padding: 8px 16px;
    justify-content: space-between;
`;

export const AiInput = styled.textarea`
    flex: 1;
    border: none;
    background-color: transparent;
    color: ${colors.grayDark};
    ${typography.bodyBaseSingle}
    font-size: 13px;
    outline: none;
    box-shadow: none;
    resize: none;
    overflow-y: auto;
    max-height: 90px;
    line-height: 1.5;
    padding: 2px 0;

    &::placeholder {
        color: ${colors.grayMedium};
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
`;

export const AiSendIcon = styled.img`
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

export const EmptyState = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    width: 516px;
    margin-left: 35px;
    padding: 40px 24px;
    text-align: center;
    background-color: ${colors.grayLighter};
    border-radius: 8px;
`;

export const PaginationWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 38px;
    margin-top: 8px;
    margin-bottom: 24px;
    width: 544px;
`;

export const PageBtn = styled.button`
    background: none;
    border: none;
    padding: 4px 8px;
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    ${typography.bodyBaseSingle};
    font-size: 14px;
    color: ${({ $active }) => ($active ? colors.black : colors.grayDark)};
    font-weight: ${({ $active }) => ($active ? "700" : "400")};
    opacity: ${({ disabled }) => (disabled ? "0.4" : "1")};
`;
