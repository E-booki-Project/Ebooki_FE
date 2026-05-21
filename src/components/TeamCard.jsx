import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as TC from "../styles/components/TeamCardStyle";
import { getTeamDetail } from "../api/team";
import more from "../assets/images/more.png";
import starOn from "../assets/images/star_full.png";
import starOff from "../assets/images/star.png";

function TeamCard({ team }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleEditClick = () => {
        navigate(`/edit/${team.id}`);
        setIsMenuOpen(false);
    };

    const handleRecordClick = async () => {
        setIsMenuOpen(false);
        try {
            const detail = await getTeamDetail(team.id);
            const bookId = detail.bookData?.bookId ?? detail.bookData?.id;
            if (!bookId) { alert("도서 정보를 찾을 수 없습니다."); return; }
            navigate(`/books/detail/${bookId}`, { state: { teamId: team.id } });
        } catch {
            alert("도서 정보를 불러오는데 실패했습니다.");
        }
    };
    return (
        <TC.TeamCard>
            <TC.ImageWrapper>
                <TC.BookImage
                    src={team.bookImage}
                    alt={team.bookTitle}
                    onClick={() => navigate(`/reader/${team.id}/${team.bookId}`)}
                    style={{ cursor: "pointer" }}
                />
                <TC.MenuWrapper ref={menuRef}>
                    <TC.MoreIcon
                        src={more}
                        alt="메뉴 열기"
                        onClick={handleMenuToggle}
                    />
                    {isMenuOpen && (
                        <TC.Dropdown>
                            <TC.DropdownItem
                                type="button"
                                onClick={handleEditClick}
                            >
                                팀 수정
                            </TC.DropdownItem>
                            <TC.DropdownItem
                                type="button"
                                onClick={handleRecordClick}
                            >
                                내 기록 보기
                            </TC.DropdownItem>
                        </TC.Dropdown>
                    )}
                </TC.MenuWrapper>
            </TC.ImageWrapper>

            <TC.BookInfo>
                <TC.TeamTitle>{team.teamName}</TC.TeamTitle>
                <TC.BookTitle>{team.bookTitle}</TC.BookTitle>
                <TC.RatingRow>
                    {Array.from({ length: 5 }, (_, index) => (
                        <TC.StarIcon
                            key={index}
                            src={team.rating != null && index < team.rating ? starOn : starOff}
                            alt="별점"
                        />
                    ))}
                </TC.RatingRow>
                <TC.ProgressBarBg>
                    <TC.ProgressBarFill $progress={team.progress} />
                </TC.ProgressBarBg>
            </TC.BookInfo>
            <TC.MemberList>
                {team.members.map((member) => (
                    <TC.Member
                        key={member.id}
                        src={member.image}
                        alt="팀원 프로필"
                        $isDefault={member.isDefault}
                        $borderColor={member.borderColor}
                    />
                ))}
            </TC.MemberList>
        </TC.TeamCard>
    );
}

export default TeamCard;
