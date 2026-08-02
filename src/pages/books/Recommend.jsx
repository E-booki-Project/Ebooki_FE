import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import * as S from "../../styles/books/RecommendStyle";
import starFull from "../../assets/images/star_full.png";
import bookImg from "../../assets/images/book.png";

const MOCK_BOOKS = [
    { id: 1, title: "가을", rating: 4.0 },
    { id: 2, title: "가을", rating: 4.0 },
    { id: 3, title: "가을", rating: 4.0 },
    { id: 4, title: "가을", rating: 4.0 },
];

const MOCK_LIBRARIES = [
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5765, lng: 126.9695 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5745, lng: 126.9685 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5755, lng: 126.9705 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5735, lng: 126.9715 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5725, lng: 126.9675 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5775, lng: 126.9665 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5715, lng: 126.9725 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5785, lng: 126.9655 },
    { name: "도서관", address: "서울특별시 종로구 사직로9길 7", lat: 37.5705, lng: 126.9735 },
];

const TOTAL_PAGES = 68;
const PAGE_WINDOW = 2;

function getPaginationItems(current, total) {
    const items = new Set([1, 2, total - 1, total]);
    for (let i = current - PAGE_WINDOW; i <= current + PAGE_WINDOW; i++) {
        if (i >= 1 && i <= total) items.add(i);
    }
    const sorted = [...items].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
        result.push(sorted[i]);
    }
    return result;
}

function Recommend() {
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("bookId");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = TOTAL_PAGES;
    const mapRef = useRef(null);

    useEffect(() => {
        const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
        if (!jsKey) return;

        const scriptId = "kakao-map-sdk";
        if (document.getElementById(scriptId)) {
            initMap();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&libraries=services&autoload=false`;
        script.onload = () => window.kakao.maps.load(initMap);
        document.head.appendChild(script);

        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initMap = () => {
        if (!mapRef.current || !window.kakao?.maps) return;

        const { kakao } = window;
        const center = new kakao.maps.LatLng(37.5755, 126.9695);
        const map = new kakao.maps.Map(mapRef.current, {
            center,
            level: 5,
        });

        MOCK_LIBRARIES.forEach((lib) => {
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lib.lat, lib.lng),
                map,
            });

            const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:6px 10px;font-size:13px;">${lib.name}</div>`,
            });

            kakao.maps.event.addListener(marker, "mouseover", () =>
                infowindow.open(map, marker)
            );
            kakao.maps.event.addListener(marker, "mouseout", () =>
                infowindow.close()
            );
        });
    };

    return (
        <S.Page>
            <S.MapSection>
                <S.MapContainer ref={mapRef} />

                <S.RecommendPanel>
                    <S.PanelTitle>추천 도서</S.PanelTitle>
                    <S.BookList>
                        {MOCK_BOOKS.map((book) => (
                            <S.BookCard key={book.id}>
                                <S.BookCover src={bookImg} alt={book.title} />
                                <S.BookTitle>{book.title}</S.BookTitle>
                                <S.BookRating>
                                    <S.StarIcon src={starFull} alt="" />
                                    <S.RatingText>{book.rating.toFixed(1)}</S.RatingText>
                                </S.BookRating>
                            </S.BookCard>
                        ))}
                    </S.BookList>
                </S.RecommendPanel>

                <S.LibraryPanel>
                <S.LibraryList>
                    {MOCK_LIBRARIES.map((lib, i) => (
                        <S.LibraryItem key={i}>
                            <S.LibraryName>{lib.name}</S.LibraryName>
                            <S.LibraryAddress>{lib.address}</S.LibraryAddress>
                        </S.LibraryItem>
                    ))}
                </S.LibraryList>

                <S.Pagination>
                    {getPaginationItems(currentPage, totalPages).map((item, i) =>
                        item === "..." ? (
                            <S.Ellipsis key={`ellipsis-${i}`}>...</S.Ellipsis>
                        ) : (
                            <S.PageButton
                                key={item}
                                $active={currentPage === item}
                                onClick={() => setCurrentPage(item)}
                            >
                                {item}
                            </S.PageButton>
                        )
                    )}
                </S.Pagination>
                </S.LibraryPanel>
            </S.MapSection>
        </S.Page>
    );
}

export default Recommend;
