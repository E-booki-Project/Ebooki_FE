import React, { useState } from "react";
import * as S from "../styles/components/SearchBoxStyle";

import search from "../assets/images/search.png";
import back from "../assets/images/X.png";

function SearchBox({ onSearch }) {
    const [value, setValue] = useState("");

    const handleClear = () => {
        setValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch?.(value);
        }
    };
    return (
        <S.SearchBox>
            <S.SearchIcon src={search} />
            <S.InputFeild
                placeholder="검색"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <S.DeleteIcon src={back} alt="clear" onClick={handleClear} />
        </S.SearchBox>
    );
}

export default SearchBox;
