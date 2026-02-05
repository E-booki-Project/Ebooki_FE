import { Routes, Route } from "react-router-dom";
import "./App.css";

import ForgotPassword from "./pages/auth/ForgotPassword";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";

import Detail from "./pages/books/Detail";
import List from "./pages/books/List";
import Reader from "./pages/books/Reader";

import Invite from "./pages/team/Invite";
import Join from "./pages/team/Join";
import TeamList from "./pages/team/TeamList";

import Pricing from "./pages/pricing/Pricing";
import PaymentStatus from "./pages/pricing/PaymentStatus";

import Home from "./pages/home/Home";

import Mypage from "./pages/mypage/Mypage";
import ProfileView from "./pages/mypage/ProfileView";
import ProfileEdit from "./pages/mypage/ProfileEdit";

import AppLayout from "./layouts/AppLayout";

function App() {
    return (
        <div className="App">
            <Routes>
                {/* 헤더 없는 페이지 */}
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />

                {/* 헤더 있는 페이지 */}
                <Route element={<AppLayout />}>
                    <Route path="/books" element={<List />} />
                    <Route path="/reader/:bookId" element={<Reader />} />
                    <Route path="/books/detail/:bookId" element={<Detail />} />

                    <Route path="/invite/:teamId" element={<Invite />} />
                    <Route path="/join/:teamId" element={<Join />} />
                    <Route path="/teams" element={<TeamList />} />

                    <Route path="/pricing" element={<Pricing />} />
                    <Route
                        path="/payments/callback"
                        element={<PaymentStatus />}
                    />

                    <Route path="/" element={<Home />} />

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
