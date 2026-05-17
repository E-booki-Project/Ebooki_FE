import React from "react";
import * as RA from "../styles/components/ReadingAnalysisStyle";

const MAX_BAR_HEIGHT = 120;
const BAR_COLORS = [
    "rgba(205, 242, 167, 0.30)",
    "rgba(137, 209, 217, 0.30)",
    "rgba(242, 207, 102, 0.30)",
    "rgba(242, 148, 156, 0.30)",
];

function ReadingAnalysis({ data }) {
    const totalReadCount = data?.totalReadCount ?? 0;
    const categoryStats = data?.categoryStats ?? [];

    const maxCount = Math.max(...categoryStats.map((c) => c.count), 1);
    const topCategory = categoryStats.length > 0
        ? categoryStats.reduce((max, c) => (c.count > max.count ? c : max))
        : null;

    const displayStats = categoryStats.length > 0
        ? categoryStats
        : [
            { category: "", count: 0 },
            { category: "", count: 0 },
            { category: "", count: 0 },
            { category: "", count: 0 },
          ];

    const subText = topCategory
        ? `가장 많이 읽은 분야는 ${topCategory.category} 분야에요.\n앞으로도 계속 같이 읽어요.`
        : `가장 많이 읽은 분야를 선정하기 어려워요.\n앞으로도 계속 같이 읽어요.`;

    return (
        <RA.Container>
            <RA.SectionLabel>독서 분석</RA.SectionLabel>
            <RA.TotalText>총 {totalReadCount}권 독서 완료</RA.TotalText>
            <RA.SubText>{subText}</RA.SubText>
            <RA.BarsRow>
                {displayStats.map((stat, i) => (
                    <RA.Bar
                        key={i}
                        $height={(stat.count / maxCount) * MAX_BAR_HEIGHT}
                        $color={BAR_COLORS[i % BAR_COLORS.length]}
                    />
                ))}
            </RA.BarsRow>
            <RA.LabelsRow>
                {displayStats.map((stat, i) => (
                    <RA.BarLabelGroup key={i}>
                        <RA.BarCategory>{stat.category}</RA.BarCategory>
                        <RA.BarCount><span>{stat.count}</span>권</RA.BarCount>
                    </RA.BarLabelGroup>
                ))}
            </RA.LabelsRow>
        </RA.Container>
    );
}

export default ReadingAnalysis;
