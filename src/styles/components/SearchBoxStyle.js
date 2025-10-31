import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const SearchBox = styled.div`
    background-color: ${colors.white};
    border: 1px solid ${colors.grayMedium};
    border-radius: 9999px;
    width: 400px;
    height: 40px;
    padding: 12px 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 48px;
`;

export const SearchIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const InputFeild = styled.input`
    ${typography.bodyBaseSingle};
    border: none;
    height: 100%;
    width: 320px;
    &::placeholder {
        color: ${colors.black};
        ${typography.bodyBaseSingle};
    }
    &:focus {
        outline: none;
    }
`;

export const DeleteIcon = styled.img`
    width: 16px;
    height: 16px;
`;
