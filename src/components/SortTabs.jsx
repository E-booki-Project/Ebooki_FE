import React from "react";
import * as S from "../styles/components/SortTabsStyle";

function SortButton({ value, onChange }) {
    const options = [
        { label: "최신순", value: "latest" },
        { label: "인기순", value: "popular" },
        { label: "평점순", value: "rating" },
    ];
    return (
        <S.SortTabs>
            {options.map((option) => (
                <S.TabButton
                    key={option.value}
                    type="button"
                    $active={value === option.value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </S.TabButton>
            ))}
        </S.SortTabs>
    );
}

export default SortButton;
