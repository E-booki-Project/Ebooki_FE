import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const ProfileEdit = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px;
    width: 100%;
    height: 100%;
`;

export const Header = styled.div`
    align-self: flex-start;
    width: 24px;
    height: 24px;
`;

export const ProfileWrapper = styled.button`
    width: 170px;
    height: 170px;
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-bottom: 28px;
`;

export const ProfileIcon = styled.img`
    position: absolute;
    inset: 0;
    margin: auto;
    width: 60px;
    height: 60px;
    z-index: 4;
    pointer-events: none;
`;

export const ProfileInput = styled.input`
    display: none;
`;

export const ProfileImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const AccountSettings = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${colors.white};
    border: 1px solid ${colors.grayMedium};
    padding: 16px 23px;
`;

export const Form = styled.form`
    gap: 16px;
    display: flex;
    flex-direction: column;
`;

export const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const InputLabel = styled.label`
    ${typography.bodyBase};
`;

export const InputFeild = styled.input`
    width: 404px;
    height: 40px;
    border: 1px solid ${colors.grayMedium};
    border-radius: 8px;
    padding: 12px 16px;
    &::placeholder {
        color: ${colors.grayLight};
        ${typography.bodyBaseSingle};
    }
`;

export const EditButton = styled.button`
    width: 407px;
    height: 32px;
    background-color: ${colors.grayLight};
    border: none;
    border-radius: 8px;
    color: ${colors.black};
    ${typography.bodyBaseSingle};
    text-align: center;
    margin-top: 8px;
`;

export const WithdrawButton = styled.button`
    margin-top: 32px;
    border: none;
    background-color: transparent;
    color: #c00f0c;
    ${typography.bodySmall};
    text-decoration: underline;
`;
