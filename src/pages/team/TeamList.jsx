import { useState, useEffect } from "react";
import * as TL from "../../styles/team/TeamListStyle";
import TeamCard from "../../components/TeamCard";
import { getTeamList } from "../../api/team";

function TeamList() {
    const [teams, setTeams] = useState([]);

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
                    rating: Math.round(team.averageRating),
                    progress: team.progressPercentage,
                    members: team.memberProfiles.map((member, index) => ({
                        id: index,
                        image: member.profileImage,
                        userColor: member.userColor,
                        isDefault: false,
                    })),
                }));
                setTeams(mapped);
            } catch (error) {
                alert(error.response?.data?.message || "팀 목록을 불러오는데 실패했습니다.");
            }
        };
        fetchTeams();
    }, []);

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
