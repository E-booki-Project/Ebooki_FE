import React from "react";
import { useNavigate } from "react-router-dom";
import * as LO from "../styles/components/LoggedOutStyle";

function LoggedOut() {
    const navigate = useNavigate();

    return (
        <LO.LoggedOut>
            <LO.Section>
                <LO.StartButton onClick={() => navigate("/signin")}>시작하기</LO.StartButton>
            </LO.Section>
        </LO.LoggedOut>
    );
}

export default LoggedOut;
