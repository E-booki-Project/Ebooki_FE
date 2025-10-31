import React from "react";
import * as S from "../styles/components/SearchBoxStyle";

import search from "../assets/images/search.png";
import back from "../assets/images/X.png";

function SearchBox() {
    return (
        <S.SearchBox>
            <S.SearchIcon src={search} />
            <S.InputFeild placeholder="검색" />
            <S.DeleteIcon src={back} />
        </S.SearchBox>
    );
}

export default SearchBox;
