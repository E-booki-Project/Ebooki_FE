import React from "react";
import * as M from "../../styles/mypage/MypageStyle";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

function Mypage() {
    return (
        <M.Mypage>
            <M.Layout>
                <M.Section>
                    <ProfileEdit />
                </M.Section>
                <M.Section></M.Section>
            </M.Layout>
        </M.Mypage>
    );
}

export default Mypage;
