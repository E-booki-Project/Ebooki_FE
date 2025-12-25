import React from "react";
import * as R from "../../styles/books/ReaderStyle";
import SideComment from "../../components/SideComment";

function Reader() {
    return (
        <R.Reader>
            <R.SideSection>
                <SideComment />
            </R.SideSection>
        </R.Reader>
    );
}

export default Reader;
