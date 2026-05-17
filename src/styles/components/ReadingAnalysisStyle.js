import styled from "styled-components";
import { colors } from "../colors";
import { typography } from "../typography";

export const Container = styled.div`
    padding: 24px 60px 16px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    padding-bottom: 40px;
`;

export const SectionLabel = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    margin-bottom: 6px;
`;

export const TotalText = styled.div`
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 6px;
`;

export const SubText = styled.div`
    ${typography.bodySmall};
    color: ${colors.grayDark};
    margin-bottom: 24px;
    white-space: pre-line;
`;

export const BarsRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 120px;
`;

export const Bar = styled.div`
    flex: 1;
    height: ${({ $height }) => $height}px;
    min-height: 4px;
    background-color: ${({ $color }) => $color};
    border-radius: 4px 4px 0 0;
`;

export const LabelsRow = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 10px;
`;

export const BarLabelGroup = styled.div`
    flex: 1;
    text-align: center;
`;

export const BarCategory = styled.div`
    font-size: 12px;
    color: ${colors.grayDark};
    margin-bottom: 2px;
`;

export const BarCount = styled.div`
    font-size: 14px;
    font-weight: 600;

    span {
        font-size: 18px;
    }
`;
