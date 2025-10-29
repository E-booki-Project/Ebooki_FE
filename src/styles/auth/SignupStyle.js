import styled from "styled-components";
import { typography } from "../typography";

export const Signup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

export const SignupContainer = styled.div`
    width: 320px;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 8px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
`;

export const Profile = styled.div`
    border-radius: 9999px;
    background-color: #f5f5f5;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ProfileIcon = styled.img`
    width: 16px;
    height: 16px;
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
    width: 272px;
    height: 40px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 12px 16px;
    &::placeholder {
        color: #b3b3b3;
        ${typography.bodyBaseSingle};
    }
`;

export const SignupButton = styled.button`
    width: 272px;
    height: 40px;
    background-color: #f2949c;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    ${typography.bodyBaseSingle};
`;
