import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const SuccessContainer = styled.div`
    width: 672px;
    background-color: ${colors.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 161px;
    border-radius: 8px;
`;

export const ImageIcon = styled.img`
    width: 180px;
    height: 180px;
    border-radius: 999px;
    background-color: ${colors.grayMedium};
`;

export const SuccessText = styled.div`
    margin: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Title = styled.div`
    ${typography.bodySmall};
    margin-bottom: 8px;
    font-size: 24px;
    color: ${colors.black};
`;

export const Content = styled.div`
    ${typography.bodyBase};
    color: ${colors.black};
`;

export const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
`;

export const CancelButton = styled.button`
    width: 167px;
    height: 46px;
    background-color: ${colors.white};
    border: 1px solid ${colors.grayMedium};
    border-radius: 8px;
    color: ${colors.black};
    ${typography.bodyBaseSingle};
`;

export const ConfirmButton = styled.button`
    width: 167px;
    height: 46px;
    background-color: ${colors.coral};
    border: none;
    border-radius: 8px;
    color: ${colors.white};
    ${typography.bodyBaseSingle};
`;
