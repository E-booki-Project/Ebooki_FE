import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const SortTabs = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
    margin-top: 48px;
    margin-bottom: 24px;
`;

export const TabButton = styled.button`
    border: none;
    background: ${({ $active }) => ($active ? colors.white : "transparent")};
    color: ${({ $active }) => ($active ? colors.black : colors.grayDark)};
    ${typography.bodyBaseSingle};
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 999px;
    cursor: pointer;
`;
