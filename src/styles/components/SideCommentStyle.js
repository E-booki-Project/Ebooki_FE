import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const SideComment = styled.div`
    width: 240px;
    max-height: 535px;
    padding: 48px 24px 16px 24px;
    background-color: ${colors.white};
    display: flex;
    border-radius: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    display: block;
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

export const BookQuotes = styled.div`
    ${typography.bodyBase};
    font-size: 13px;
    white-space: pre-wrap;
    color: ${colors.black};
    .highlight {
        display: inline;
        padding: 0 2px;

        box-shadow: inset 0 -1.1em 0 rgba(255, 216, 237, 0.3);

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
`;

export const ProfileName = styled.div`
    ${typography.bodyStrong};
    font-size: 14px;
`;

export const MoreIcon = styled.img`
    width: 16px;
    height: 16px;
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
    align-items: center;
    background-color: ${colors.grayLighter};
    border-radius: 8px;
    height: 36px;
    padding: 12px 16px;
`;

export const Input = styled.input`
    border: none;
    background-color: transparent;
    color: ${colors.grayDark};
    ${typography.bodyBaseSingle}
    font-size: 12px;
`;

export const EnterIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-left: 4px;
`;
