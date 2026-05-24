import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const Invite = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

export const InviteContainer = styled.div`
    width: 596px;
    background-color: ${colors.white};
    border: 1px solid ${colors.grayMedium};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 8px;
`;

export const InviteHeader = styled.div`
    margin-bottom: 64px;
    align-self: flex-end;
`;

export const BackIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const BookWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
`;

export const Book = styled.img`
    width: 152px;
`;

export const BookDesc = styled.div`
    margin-top: 8px;
    ${typography.bodyBase};
`;

export const InputWrapeer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 350px;
    height: 46px;
    border: 1px solid ${colors.grayMedium};
    border-radius: 9999px;
    padding: 12px 16px;
`;

export const InputFeild = styled.input`
    border: none;
    height: 100%;
    width: 294px;
    &::placeholder {
        color: ${colors.black};
        ${typography.bodyStrong};
    }
    &:focus {
        outline: none;
    }
`;

export const LinkContainer = styled.div`
    margin-top: 48px;
    background-color: ${colors.grayLighter};
    border: 1px solid ${colors.grayMedium};
    width: 100%;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const LinkWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    width: 398px;
`;

export const LinkIcon = styled.img`
    width: 44px;
    height: 44px;
`;

export const LinkContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 270px;
`;

export const LinkTitle = styled.div`
    ${typography.subHeading}
    width: 100%;
`;

export const LinkSub = styled.div`
    ${typography.bodySmall}
    width: 100%;
`;

export const LinkButton = styled.button`
    color: ${colors.grayLighter};
    ${typography.bodyBaseSingle};
    background-color: ${colors.coral};
    border-radius: 8px;
    width: 99px;
    height: 40px;
    padding: 12px;
    border: none;
`;

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    gap: 8px;
`;

export const ListWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 532px;
`;

export const ListContent = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
`;

export const Profile = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
`;

export const Username = styled.div`
    ${typography.bodyBase};
    width: 444px;
`;

export const More = styled.img`
    width: 20px;
    height: 20px;
`;

export const ConfirmButton = styled.button`
    background-color: ${colors.coral};
    color: ${colors.white};
    border: none;
    border-radius: 9999px;
    padding: 4px 14px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 13px;
    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export const CheckIcon = styled.img`
    width: 22px;
    height: 22px;
`;
