import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import ForgotPassword from "./pages/auth/ForgotPassword";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import Detail from "./pages/books/Detail";
import List from "./pages/books/List";
import Reader from "./pages/books/Reader";
import Invite from "./pages/team/Invite";
import Join from "./pages/team/Join";
import Pricing from "./pages/pricing/Pricing";
import Search from "./pages/books/Search";
import Home from "./pages/home/Home";
import PaymentStatus from "./pages/pricing/PaymentStatus";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/books" element={<List />} />
                <Route path="/reader/:bookId" element={<Reader />} />
                <Route path="/books/detail/:bookId" element={<Detail />} />
                <Route path="/invite/:teamId" element={<Invite />} />
                <Route path="/join/:teamId" element={<Join />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/books/search" element={<Search />} />
                <Route path="/" element={<Home />} />
                <Route path="/payments/callback" element={<PaymentStatus />} />
            </Routes>
        </div>
    );
}

export default App;
