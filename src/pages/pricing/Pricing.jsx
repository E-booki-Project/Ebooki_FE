import React from "react";
import * as P from "../../styles/pricing/PricingStyle";

import Check from "../../assets/images/check.png";
import price1 from "../../assets/images/price_1.png";
import price2 from "../../assets/images/price_2.png";
import price3 from "../../assets/images/price_3.png";

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
                        <P.PlanIcon src={price1} />
                        <P.PlanWrapper>
                            <P.PlanName>작심삼일 요금제</P.PlanName>
                            <P.PlanPrice>
                                9,900<span> / 2+1 권</span>
                            </P.PlanPrice>
                        </P.PlanWrapper>
                    </P.PlanHeader>
                    <P.PlanContent>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                한 달에 3권, 부담 없이 시작해요
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                혼자보다 함께라서 더 꾸준해요
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                교환 독서를 처음 경험해보세요!
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
                        <P.PlanIcon src={price2} />
                        <P.PlanWrapper>
                            <P.PlanName>작심한주 요금제</P.PlanName>
                            <P.PlanPrice>
                                15,000<span> / 6+1 권</span>
                            </P.PlanPrice>
                        </P.PlanWrapper>
                    </P.PlanHeader>
                    <P.PlanContent style={{ marginTop: "88px" }}>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>매달 여유롭게 읽는 7권</P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                함께 읽고 나누며 깊어지는 독서
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                1년 독서 루틴을 만들어보세요!
                            </P.PlanDesc>
                        </P.ContentWrapper>
                    </P.PlanContent>
                    <P.PlanButton>요금제 선택</P.PlanButton>
                </P.PlanCard>
                <P.PlanCard>
                    <P.PlanHeader>
                        <P.PlanIcon src={price3} />
                        <P.PlanWrapper>
                            <P.PlanName>작심한달 요금제</P.PlanName>
                            <P.PlanPrice>
                                21,000<span> / 9+3 권</span>
                            </P.PlanPrice>
                        </P.PlanWrapper>
                    </P.PlanHeader>
                    <P.PlanContent>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                넉넉한 12권으로 깊이 있는 독서
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>
                                마음껏 읽고 자유롭게 교환해요
                            </P.PlanDesc>
                        </P.ContentWrapper>
                        <P.ContentWrapper>
                            <P.CheckIcon src={Check} />
                            <P.PlanDesc>독서가 생활이 되는 플랜</P.PlanDesc>
                        </P.ContentWrapper>
                    </P.PlanContent>
                    <P.PlanButton>요금제 선택</P.PlanButton>
                </P.PlanCard>
            </P.PlanContainer>
        </P.Pricing>
    );
}

export default Pricing;
