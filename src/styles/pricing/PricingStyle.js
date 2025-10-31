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

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 75px;
`;

export const Title = styled.div`
    font-weight: 700;
    font-size: 48px;
    line-height: 120%;
    letter-spacing: -0.96px;
`;

export const SubTitle = styled.div`
    ${typography.bodyBase};
    margin-top: 12px;
    text-align: center;
`;

export const PlanContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 24px;
`;

export const PlanCard = styled.div`
    position: relative;
    width: 300px;
    height: 370px;
    background-color: ${colors.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-radius: 8px;
`;

export const PlanHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    width: 247px;
`;

export const PlanIcon = styled.div`
    width: 90px;
    height: 90px;
    border-radius: 9999px;
    margin-right: 12px;
    background-color: ${colors.grayMedium};
`;

export const PlanWrapper = styled.div``;

export const PlanName = styled.div`
    ${typography.bodyBase}
`;

export const PlanPrice = styled.div`
    ${typography.bodyStrong};
    font-size: 24px;
    span {
        ${typography.bodyBase};
    }
`;

export const PlanContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    margin-top: 68px;
    gap: 8px;
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 100%;
`;

export const CheckIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 12px;
`;

export const PlanDesc = styled.div`
    ${typography.bodyBase};
`;

export const PlanButton = styled.button`
    width: 100%;
    height: 50px;
    background-color: ${colors.coral};
    border: none;
    border-radius: 8px;
    color: ${colors.white};
    ${typography.bodyBaseSingle};
`;

export const RecommendedTag = styled.div`
    position: absolute;
    z-index: 3;
    background-color: ${colors.yellow};
    ${typography.bodyBase};
    transform: rotate(-30deg);
    width: 170px;
    height: 40px;
    padding: 9px 12.5px;
    top: -35px;
    left: 210px;
`;
