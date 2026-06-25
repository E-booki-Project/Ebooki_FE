import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as TL from "../../styles/team/TeamListStyle";
import TeamCard from "../../components/TeamCard";
import { getTeamList } from "../../api/team";

const USER_COLOR_MAP = {
    BLUE: "#89d1d9",
    GREEN: "#cdf2a7",
    PINK: "#f2949c",
    YELLOW: "#f2cf66",
};

function TeamList() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await getTeamList();
                const mapped = data.teams.map((team) => ({
                    id: team.teamId,
                    bookId: team.bookId,
                    bookImage: team.bookImage,
                    teamName: team.teamName,
                    bookTitle: team.bookTitle,
                    rating: team.averageRating != null ? Math.round(team.averageRating) : null,
                    progress: team.progressPercentage ?? 0,
                    members: team.memberProfiles.map((member, index) => ({
                        id: index,
                        image: member.profileImage,
                        borderColor: USER_COLOR_MAP[member.userColor] ?? null,
                        isDefault: false,
                    })),
                }));
                setTeams(mapped);
            } catch (error) {
                alert(error.response?.data?.message || "팀 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (!isLoading && teams.length === 0) {
        return (
            <TL.TeamList>
                <TL.EmptyState>
                    아직 소속된 팀이 없어요. 책을 골라 팀을 만들어보세요!
                    <TL.EmptyStateButton type="button" onClick={() => navigate("/books")}>
                        도서 리스트로 가기
                    </TL.EmptyStateButton>
                </TL.EmptyState>
            </TL.TeamList>
        );
    }

    return (
        <TL.TeamList>
            <TL.Grid>
                {teams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </TL.Grid>
        </TL.TeamList>
    );
}

export default TeamList;
