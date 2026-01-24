import React, { useState } from "react";
import * as M from "../../styles/mypage/MypageStyle";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

function Mypage() {
    const [mode, setMode] = useState("view");

    return (
        <M.Mypage>
            <M.Layout>
                <M.Section>
                    {mode === "view" ? (
                        <ProfileView onEdit={() => setMode("edit")} />
                    ) : (
                        <ProfileEdit onCancel={() => setMode("view")} />
                    )}
                </M.Section>
                <M.Section></M.Section>
            </M.Layout>
        </M.Mypage>
    );
}

export default Mypage;
