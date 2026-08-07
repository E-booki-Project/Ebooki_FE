import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import * as S from "../../styles/books/RecommendStyle";
import { getNextRecommendation, getLibrariesByIsbn } from "../../api/recommend";

const ITEMS_PER_PAGE = 9;
const PAGE_WINDOW = 2;

const PINK_MARKER_SVG = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="42" viewBox="0 0 29 42">' +
    '<path fill="#FF6B81" stroke="white" stroke-width="2" stroke-linejoin="round" d="M14.5 1C7.044 1 1 7.044 1 14.5 1 24.625 14.5 41 14.5 41S28 24.625 28 14.5C28 7.044 21.956 1 14.5 1zm0 20.25a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5z"/>' +
    '</svg>'
)}`;

function getPaginationItems(current, total) {
    if (total <= 1) return [];
    const items = new Set([1, 2, total - 1, total].filter((p) => p >= 1 && p <= total));
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

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]); // [{marker, lib}]
    const selectedMarkerRef = useRef(null);
    const mapReadyRef = useRef(false);
    const selectedItemRef = useRef(null);

    const totalPages = Math.ceil(libraries.length / ITEMS_PER_PAGE);
    const pagedLibraries = libraries.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    useEffect(() => {
        const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
        if (!jsKey) return;

        const scriptId = "kakao-map-sdk";
        if (document.getElementById(scriptId)) {
            if (window.kakao?.maps) initMap();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&libraries=services&autoload=false`;
        script.onload = () => window.kakao.maps.load(initMap);
        document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initMap = () => {
        if (!mapRef.current || !window.kakao?.maps) return;
        const { kakao } = window;
        mapInstanceRef.current = new kakao.maps.Map(mapRef.current, {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 8,
        });
        mapReadyRef.current = true;
    };

    const fetchLibraries = (isbn13) => {
        if (!isbn13) return;
        setCurrentPage(1);
        setSelectedLibrary(null);
        selectedMarkerRef.current = null;
        getLibrariesByIsbn(isbn13)
            .then((data) => setLibraries(data?.libraries ?? []))
            .catch(console.error);
    };

    useEffect(() => {
        if (!bookId) return;
        getNextRecommendation(bookId)
            .then((data) => {
                const bookList = data?.books ?? [];
                setBooks(bookList);
                if (bookList.length > 0) {
                    setSelectedBook(bookList[0]);
                    fetchLibraries(bookList[0].isbn13);
                }
            })
            .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId]);

    useEffect(() => {
        if (!mapReadyRef.current || !window.kakao?.maps || libraries.length === 0) return;
        const { kakao } = window;
        const map = mapInstanceRef.current;

        markersRef.current.forEach(({ marker }) => marker.setMap(null));
        markersRef.current = [];
        selectedMarkerRef.current = null;

        const bounds = new kakao.maps.LatLngBounds();

        libraries.forEach((lib, index) => {
            const pos = new kakao.maps.LatLng(
                parseFloat(lib.latitude),
                parseFloat(lib.longitude),
            );
            const marker = new kakao.maps.Marker({ position: pos, map });
            const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">${lib.libName}</div>`,
            });
            kakao.maps.event.addListener(marker, "mouseover", () => infowindow.open(map, marker));
            kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());
            kakao.maps.event.addListener(marker, "click", () => {
                if (selectedMarkerRef.current) {
                    selectedMarkerRef.current.setImage(null);
                }
                const markerImage = new kakao.maps.MarkerImage(
                    PINK_MARKER_SVG,
                    new kakao.maps.Size(27, 40),
                    { offset: new kakao.maps.Point(13, 40) },
                );
                marker.setImage(markerImage);
                selectedMarkerRef.current = marker;
                map.setLevel(4);
                map.panTo(pos);
                setSelectedLibrary(lib);
                setCurrentPage(Math.ceil((index + 1) / ITEMS_PER_PAGE));
            });
            markersRef.current.push({ marker, lib });
            bounds.extend(pos);
        });

        map.setBounds(bounds);
    }, [libraries]);

    useEffect(() => {
        if (selectedLibrary && selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [selectedLibrary]);

    const handleLibraryClick = (lib) => {
        if (!mapReadyRef.current || !window.kakao?.maps) return;
        const { kakao } = window;
        const map = mapInstanceRef.current;

        if (selectedMarkerRef.current) {
            selectedMarkerRef.current.setImage(null);
        }

        const found = markersRef.current.find(({ lib: l }) => l.libCode === lib.libCode);
        if (found) {
            const markerImage = new kakao.maps.MarkerImage(
                PINK_MARKER_SVG,
                new kakao.maps.Size(27, 40),
                { offset: new kakao.maps.Point(13, 40) },
            );
            found.marker.setImage(markerImage);
            selectedMarkerRef.current = found.marker;

            map.setLevel(4);
            map.panTo(found.marker.getPosition());
        }

        setSelectedLibrary(lib);
    };

    return (
        <S.Page>
            <S.MapSection>
                <S.MapContainer ref={mapRef} />

                <S.RecommendPanel>
                    <S.PanelTitle>추천 도서</S.PanelTitle>
                    <S.BookList>
                        {books.map((book) => (
                            <S.BookCard
                                key={book.isbn13}
                                $selected={selectedBook?.isbn13 === book.isbn13}
                                onClick={() => {
                                    setSelectedBook(book);
                                    fetchLibraries(book.isbn13);
                                }}
                            >
                                <S.BookCover src={book.bookImageURL} alt={book.title} />
                                <S.BookTitle>{book.title}</S.BookTitle>
                                <S.BookAuthor>{book.author}</S.BookAuthor>
                            </S.BookCard>
                        ))}
                    </S.BookList>
                </S.RecommendPanel>

                <S.LibraryPanel>
                    <S.LibraryList>
                        {pagedLibraries.map((lib) => (
                            <S.LibraryItem
                                key={lib.libCode}
                                ref={selectedLibrary?.libCode === lib.libCode ? selectedItemRef : null}
                                $selected={selectedLibrary?.libCode === lib.libCode}
                                onClick={() => handleLibraryClick(lib)}
                            >
                                <S.LibraryName>{lib.libName}</S.LibraryName>
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
                            ),
                        )}
                    </S.Pagination>
                </S.LibraryPanel>
            </S.MapSection>
        </S.Page>
    );
}

export default Recommend;
