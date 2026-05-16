import React, { useState, useEffect } from "react";
import * as M from "../../styles/mypage/MypageStyle";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import BookPlanProgress from "../../components/BookPlanProgress";
import { getMypage } from "../../api/mypage";

function Mypage() {
    const [mode, setMode] = useState("view");
    const [mypageData, setMypageData] = useState(null);

    const fetchMypage = () => {
        getMypage()
            .then(setMypageData)
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchMypage();
    }, []);

    return (
        <M.Mypage>
            <M.Layout>
                <M.Section>
                    {mode === "view" ? (
                        <ProfileView onEdit={() => setMode("edit")} />
                    ) : (
                        <ProfileEdit onCancel={() => setMode("view")} onSave={() => setMode("view")} />
                    )}
                </M.Section>
                <M.Section>
                    <BookPlanProgress data={mypageData} />
                </M.Section>
            </M.Layout>
        </M.Mypage>
    );
}

export default Mypage;
