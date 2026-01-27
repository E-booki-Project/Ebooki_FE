import React from "react";
import * as TL from "../../styles/team/TeamListStyle";
import TeamCard from "../../components/TeamCard";
import bookImage from "../../assets/images/book.png";
import user1 from "../../assets/images/user_pink.png";
import user2 from "../../assets/images/user_blue.png";
import user3 from "../../assets/images/user_green.png";
import user4 from "../../assets/images/user_yellow.png";

const teamList = [
    {
        id: 1,
        bookImage: bookImage,
        teamName: "팀 이름",
        bookTitle: "시대예보: 경랑문명의 탄생",
        rating: 4,
        progress: 56,
        members: [
            {
                id: 1,
                image: user1,
                isDefault: false,
                borderColor: "#F2CF66",
            },
            { id: 2, image: user2, isDefault: false, borderColor: "#E3A8C9" },
            { id: 3, image: user3, isDefault: true },
        ],
    },
    {
        id: 2,
        bookImage: bookImage,
        teamName: "팀 이름",
        bookTitle: "시대예보: 경랑문명의 탄생시대예보:...",
        rating: 2,
        progress: 52,
        members: [
            { id: 1, image: user1, isDefault: true },
            { id: 2, image: user2, isDefault: true },
            { id: 3, image: user3, isDefault: true },
            { id: 4, image: user4, isDefault: true },
        ],
    },
    {
        id: 3,
        bookImage: bookImage,
        teamName: "팀 이름",
        bookTitle: "시대예보: 경랑문명의 탄생",
        rating: 4,
        progress: 56,
        members: [
            {
                id: 1,
                image: user1,
                isDefault: false,
                borderColor: "#F2CF66",
            },
            { id: 2, image: user2, isDefault: false, borderColor: "#E3A8C9" },
            { id: 3, image: user3, isDefault: true },
        ],
    },
    {
        id: 4,
        bookImage: bookImage,
        teamName: "팀 이름",
        bookTitle: "시대예보: 경랑문명의 탄생시대예보:...",
        rating: 2,
        progress: 52,
        members: [
            {
                id: 1,
                image: user1,
                isDefault: false,
                borderColor: "#F2CF66",
            },
            { id: 2, image: user2, isDefault: false, borderColor: "#E3A8C9" },
            { id: 3, image: user3, isDefault: true },
        ],
    },
];

function TeamList() {
    return (
        <TL.TeamList>
            <TL.Grid>
                {teamList.map((team) => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </TL.Grid>
        </TL.TeamList>
    );
}

export default TeamList;
