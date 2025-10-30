import styled from "styled-components";
import { typography } from "../typography";
import { colors } from "../colors";

export const Pricing = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

export const TitleContainer = styled.div``;

export const Title = styled.div``;

export const SubTitle = styled.div``;

export const PlanContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 24px;
`;

export const PlanCard = styled.div`
    width: 300px;
    background-color: ${colors.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 8px;
`;

export const PlanHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: center;
    width: 247px;
`;

export const PlanIcon = styled.img`
    width: 90px;
    height: 90px;
    border-radius: 9999px;
    margin-right: 12px;
`;

export const PlanWrapper = styled.div``;

export const PlanName = styled.div`
    ${typography.bodyBase}
`;

export const PlanPrice = styled.div`
    ${typography.bodyBase}
`;

export const PlanContent = styled.div``;

export const CheckIcon = styled.img`
    width: 16px;
    height: 16px;
`;

export const PlanDesc = styled.div``;

export const PlanButton = styled.button``;
