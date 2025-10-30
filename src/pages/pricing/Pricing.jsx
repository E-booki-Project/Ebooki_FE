import React from "react";
import * as P from "../../styles/pricing/PricingStyle";

function Pricing() {
    return (
        <P.Pricing>
            <P.TitleContainer>
                <P.Title>요금제 선택</P.Title>
                <P.SubTitle>
                    같이 책을 읽을 수 있는 횟수를 판매해요
                    <br />
                    읽는 즐거움에, 나누는 감동을 더하세요
                </P.SubTitle>
            </P.TitleContainer>
            <P.PlanContainer>
                <P.PlanCard>
                    <P.PlanHeader>
                        <P.PlanIcon />
                        <P.PlanWrapper>
                            <P.PlanName>요금제 이름</P.PlanName>
                            <P.PlanPrice>
                                9,900<span> / 2+1 권</span>
                            </P.PlanPrice>
                        </P.PlanWrapper>
                    </P.PlanHeader>
                    <P.PlanContent>
                        <P.PlanDesc></P.PlanDesc>
                        <P.PlanDesc></P.PlanDesc>
                        <P.PlanDesc></P.PlanDesc>
                    </P.PlanContent>
                    <P.PlanButton>요금제 선택</P.PlanButton>
                </P.PlanCard>
            </P.PlanContainer>
        </P.Pricing>
    );
}

export default Pricing;
