import styled from "styled-components";
import { typography } from "../typography";

export const Signin = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

export const EmailContainer = styled.div`
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
    gap: 24px;
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

export const SigninButton = styled.button`
    width: 272px;
    height: 40px;
    background-color: #f2949c;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    ${typography.bodyBaseSingle};
`;

export const ForgotPassword = styled.div`
    color: #757575;
    ${typography.bodyLink};
    cursor: pointer;
`;

export const SocialContainer = styled.div`
    width: 320px;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 24px 62px;
`;

export const Title = styled.div`
    margin-bottom: 24px;
    ${typography.bodyLink};
`;

export const IconWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;
`;

export const SocailIcon = styled.img`
    width: 44px;
    height: 44px;
`;
