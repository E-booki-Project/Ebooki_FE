import { Routes, Route } from "react-router-dom";
import "./App.css";

import homeBg from "./assets/images/home_bg.svg";
import landingBg from "./assets/images/landing_bg.svg";

// JS 번들 평가 시점에 대형 배경 이미지를 즉시 preload 등록
// CSS background-image는 브라우저 preload scanner에 감지되지 않으므로
// link[rel=preload]를 직접 주입해 첫 렌더 전부터 다운로드를 시작시킴
if (typeof window !== "undefined") {
    [homeBg, landingBg].forEach((href) => {
        if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.type = "image/svg+xml";
        link.href = href;
        document.head.appendChild(link);
    });
}

import ForgotPassword from "./pages/auth/ForgotPassword";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import KakaoCallback from "./pages/auth/KakaoCallback";
import NaverCallback from "./pages/auth/NaverCallback";
import GoogleCallback from "./pages/auth/GoogleCallback";

import Detail from "./pages/books/Detail";
import DetailDefault from "./pages/books/DetailDefault";
import List from "./pages/books/List";
import Reader from "./pages/books/Reader";

import Invite from "./pages/team/Invite";
import EditTeam from "./pages/team/EditTeam";
import Join from "./pages/team/Join";
import TeamList from "./pages/team/TeamList";

import Pricing from "./pages/pricing/Pricing";
import PaymentStatus from "./pages/pricing/PaymentStatus";

import Home from "./pages/home/Home";
import Landing from "./pages/home/Landing";

import Mypage from "./pages/mypage/Mypage";
import ProfileView from "./pages/mypage/ProfileView";
import ProfileEdit from "./pages/mypage/ProfileEdit";

import AppLayout from "./layouts/AppLayout";

function App() {
    return (
        <div className="App">
            <Routes>
                {/* 헤더 없는 페이지 */}
                <Route path="/" element={<Landing />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/auth/login/kakao" element={<KakaoCallback />} />
                <Route path="/auth/login/naver" element={<NaverCallback />} />
                <Route path="/auth/login/google" element={<GoogleCallback />} />

                {/* 헤더 있는 페이지 */}
                <Route element={<AppLayout />}>
                    <Route path="/books" element={<List />} />
                    <Route path="/reader/:teamId/:bookId" element={<Reader />} />
                    <Route path="/books/detail/:bookId" element={<Detail />} />
                    <Route path="/books/info/:bookId" element={<DetailDefault />} />

                    <Route path="/invite/:bookId" element={<Invite />} />
                    <Route path="/edit/:teamId" element={<EditTeam />} />
                    <Route path="/join/:teamId" element={<Join />} /> {/* teamId = 실제론 토큰 보낼예정 */}
                    <Route path="/teams" element={<TeamList />} />

                    <Route path="/pricing" element={<Pricing />} />
                    <Route
                        path="/payment/success"
                        element={<PaymentStatus />}
                    />

                    <Route path="/home" element={<Home />} />

                    <Route path="/mypage" element={<Mypage />}>
                        <Route index element={<ProfileView />} />
                        <Route path="edit" element={<ProfileEdit />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
