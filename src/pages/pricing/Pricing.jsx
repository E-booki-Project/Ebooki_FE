import React from "react";
import * as P from "../../styles/pricing/PricingStyle";

import Check from "../../assets/images/check.png";

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
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>3권을 읽을 수 있어요</P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                3한달간 교환독서를 경험해봐요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                한달간 교환독서를 경험해봐요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                    </P.PlanContent>
                    <P.PlanButton>요금제 선택</P.PlanButton>
                </P.PlanCard>
                <P.PlanCard
                    style={{
                        width: "316px",
                        height: "390px",
                        boxShadow: "0px 1px 4px rgba(12,12,13,0.05)",
                    }}
                >
                    <P.RecommendedTag>가장 추천하는 요금제</P.RecommendedTag>
                    <P.PlanHeader>
                        <P.PlanIcon />
                        <P.PlanWrapper>
                            <P.PlanName>요금제 이름</P.PlanName>
                            <P.PlanPrice>
                                15,000<span> / 6+1 권</span>
                            </P.PlanPrice>
                        </P.PlanWrapper>
                    </P.PlanHeader>
                    <P.PlanContent style={{ marginTop: "88px" }}>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>3권을 읽을 수 있어요</P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                3한달간 교환독서를 경험해봐요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                한달간 교환독서를 경험해봐요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                    </P.PlanContent>
                    <P.PlanButton>요금제 선택</P.PlanButton>
                </P.PlanCard>
                <P.PlanCard>
                    <P.PlanHeader>
                        <P.PlanIcon />
                        <P.PlanWrapper>
                            <P.PlanName>요금제 이름</P.PlanName>
                            <P.PlanPrice>
                                21,000<span> / 9+3 권</span>
                            </P.PlanPrice>
                        </P.PlanWrapper>
                    </P.PlanHeader>
                    <P.PlanContent>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>3권을 읽을 수 있어요</P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                3한달간 교환독서를 경험해봐요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                한달간 교환독서를 경험해봐요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                    </P.PlanContent>
                    <P.PlanButton>요금제 선택</P.PlanButton>
                </P.PlanCard>
            </P.PlanContainer>
        </P.Pricing>
    );
}

export default Pricing;
