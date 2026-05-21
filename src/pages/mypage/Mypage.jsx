import React, { useState, useEffect } from "react";
import * as M from "../../styles/mypage/MypageStyle";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import BookPlanProgress from "../../components/BookPlanProgress";
import ReadingAnalysis from "../../components/ReadingAnalysis";
import { getMypage } from "../../api/mypage";
import { getTeamList, getTeamDetail } from "../../api/team";
import { getMyBookItems } from "../../api/book";
import { getUserInfo } from "../../utils/authStorage";

function Mypage() {
    const [mode, setMode] = useState("view");
    const [mypageData, setMypageData] = useState(null);
    const [highlightQuote, setHighlightQuote] = useState(null);

    useEffect(() => {
        getMypage().then(setMypageData).catch(console.error);

        const loadHighlight = async () => {
            try {
                const listData = await getTeamList();
                const teams = listData.teams ?? [];
                if (teams.length === 0) return;

                const myUserId = getUserInfo()?.id;

                // 모든 팀 상세 병렬 조회
                const details = await Promise.all(
                    teams.map((t) => getTeamDetail(t.teamId).catch(() => null))
                );
                // 팀별 bookId + userColor 추출
                const teamInfos = teams
                    .map((team, i) => {
                        const detail = details[i];
                        const bookId = detail?.teamData?.teamData?.bookId;
                        const teamUserData = detail?.teamData?.teamUserData ?? [];
                        const myTeamUser = teamUserData.find(
                            (u) => Number(u.userId) === Number(myUserId)
                        );
                        return {
                            bookId,
                            userColor: myTeamUser?.userColor ?? "BLUE",
                            bookTitle: team.bookTitle,
                        };
                    })
                    .filter((t) => t.bookId);
                // 모든 북 하이라이트 병렬 조회
                const highlightResults = await Promise.all(
                    teamInfos.map((info) => getMyBookItems(info.bookId).catch(() => null))
                );
                // 전체 하이라이트 수집
                const allHighlights = [];
                teamInfos.forEach((info, i) => {
                    const result = highlightResults[i];
                    if (!result) return;
                    const items = Array.isArray(result) ? result : (result?.timeline ?? result?.data ?? []);
                    items
                        .filter((item) => item.type === "HIGHLIGHT" && Number(item.userId) === Number(myUserId))
                        .forEach((item) => {
                            allHighlights.push({
                                text: item.text,
                                bookTitle: info.bookTitle,
                                userColor: info.userColor,
                            });
                        });
                });
                if (allHighlights.length === 0) return;

                // 랜덤 선택
                const random = allHighlights[Math.floor(Math.random() * allHighlights.length)];
                setHighlightQuote(random);
            } catch (e) {
                console.error(e);
            }
        };

        loadHighlight();
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
