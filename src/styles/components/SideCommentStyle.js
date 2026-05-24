import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 33px;
    width: 240px;
    flex: 1;
    overflow-y: auto;
    padding: 24px 0 16px 0;
    scrollbar-width: thin;
    scrollbar-color: ${colors.grayLighter} transparent;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${colors.grayLighter};
        border-radius: 4px;
    }
`;

export const SideComment = styled.div`
    position: relative;
    width: 240px;
    padding: 48px 24px 16px 24px;
    background-color: ${colors.white};
    border-radius: 4px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    box-sizing: border-box;
`;

export const Tape = styled.img`
    position: absolute;
    width: 72px;
    top: -19px;
    left: 83px;
`;

export const Content = styled.div`
    display: flex;
    margin-bottom: 8px;
    width: 100%;
    max-height: 435px;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    overflow-y: scroll;
    scrollbar-width: thin;
    overflow-x: hidden;

    scrollbar-color: ${colors.grayLighter} transparent;
    &::-webkit-scrollbar {
        width: 4px;
        opacity: 50%;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${colors.grayLighter};
        border-radius: 4px;
        opacity: 50%;
    }
`;

export const HighlightBlock = styled.div`
    border-bottom: 1px solid ${colors.grayLighter};
    padding-bottom: 12px;
    margin-bottom: 12px;
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
`;

export const BookQuotes = styled.div`
    ${typography.bodyBase};
    font-size: 13px;
    white-space: pre-wrap;
    color: ${colors.black};
    .highlight {
        display: inline;
        padding: 0 2px;
        box-shadow: inset 0 -1.1em 0 ${({ $color }) => $color ?? "rgba(137, 209, 217, 0.3)"};
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
    }
`;

export const CommentContainer = styled.div`
    gap: 8px;
    margin-top: 8px;
    padding-left: 16px;
    display: flex;
    flex-direction: column;
`;

export const CommentHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 8px;
`;

export const Profile = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

export const ProfileIcon = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
`;

export const ProfileName = styled.div`
    ${typography.bodyStrong};
    font-size: 14px;
`;

export const MoreIcon = styled.img`
    width: 16px;
    height: 16px;
    cursor: pointer;
`;

export const MoreWrapper = styled.div`
    position: relative;
`;

export const MoreMenu = styled.div`
    position: absolute;
    right: 0;
    top: 20px;
    background-color: ${colors.white};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 100;
    min-width: 72px;
    overflow: hidden;
`;

export const MoreMenuDivider = styled.div`
    height: 1px;
    background-color: ${colors.grayLighter};
    margin: 0 8px;
`;

export const MoreMenuItem = styled.button`
    display: block;
    width: 100%;
    padding: 8px 12px;
    text-align: center;
    background: none;
    border: none;
    cursor: pointer;
    ${typography.bodySmall};
    font-size: 12px;
    color: ${({ $danger }) => ($danger ? "#e53e3e" : colors.black)};
`;

export const CommentText = styled.div`
    ${typography.bodySmall};
    font-size: 12px;
    white-space: pre-wrap;
    color: ${colors.black};
    margin-bottom: 8px;
`;

export const CommentReaction = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
`;

export const ReactionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const ReactionIcon = styled.img`
    width: 12px;
    height: 12px;
    margin-right: 4px;
`;

export const ReactionCount = styled.div`
    color: ${({ $active }) => ($active ? colors.coral : colors.grayDark)};

    opacity: ${({ $active }) => ($active ? "100%" : "50%")};
    ${typography.bodyBaseSingle};
    font-size: 11px;
    font-weight: 600;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    background-color: ${colors.grayLighter};
    border-radius: 8px;
    min-height: 36px;
    padding: 8px 16px;
    justify-content: space-between;
`;

export const Input = styled.textarea`
    flex: 1;
    border: none;
    background-color: transparent;
    color: ${colors.grayDark};
    ${typography.bodyBaseSingle}
    font-size: 12px;
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

    &:focus-visible {
        outline: none;
        box-shadow: none;
    }
`;

export const EnterIcon = styled.img`
    width: 20px;
    height: 20px;
    /* margin-left: 4px; */
`;
