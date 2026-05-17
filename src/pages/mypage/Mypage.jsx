import React, { useState, useEffect } from "react";
import * as M from "../../styles/mypage/MypageStyle";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import BookPlanProgress from "../../components/BookPlanProgress";
import ReadingAnalysis from "../../components/ReadingAnalysis";
import { getMypage } from "../../api/mypage";
import { getTeamList } from "../../api/team";
import { getBookTimeline } from "../../api/book";

function Mypage() {
    const [mode, setMode] = useState("view");
    const [mypageData, setMypageData] = useState(null);
    const [highlightQuote, setHighlightQuote] = useState(null);

    useEffect(() => {
        getMypage()
            .then(setMypageData)
            .catch(console.error);

        getTeamList()
            .then((data) => {
                const firstTeam = data.teams?.find((t) => t.bookId);
                if (!firstTeam) return;
                getBookTimeline(firstTeam.bookId)
                    .then((timeline) => {
                        const highlight = timeline.find((item) => item.type === "HIGHLIGHT");
                        if (highlight) {
                            setHighlightQuote({
                                text: highlight.text,
                                page: highlight.page,
                                bookTitle: firstTeam.bookTitle,
                            });
                        }
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }, []);

    return (
        <M.Mypage>
            <M.Layout>
                <M.Section>
                    {mode === "view" ? (
                        <ProfileView
                            onEdit={() => setMode("edit")}
                            highlight={highlightQuote}
                        />
                    ) : (
                        <ProfileEdit
                            onCancel={() => setMode("view")}
                            onSave={() => setMode("view")}
                        />
                    )}
                </M.Section>
                <M.Section>
                    <M.RightContent>
                        <BookPlanProgress data={mypageData} />
                        <ReadingAnalysis data={mypageData} />
                    </M.RightContent>
                </M.Section>
            </M.Layout>
        </M.Mypage>
    );
}

export default Mypage;
