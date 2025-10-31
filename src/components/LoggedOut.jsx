import React from "react";
import * as LO from "../styles/components/LoggedOutStyle";

function LoggedOut() {
    return (
        <LO.LoggedOut>
            <LO.Section>
                <LO.StartButton>시작하기</LO.StartButton>
            </LO.Section>
        </LO.LoggedOut>
    );
}

export default LoggedOut;
