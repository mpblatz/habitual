import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/layout/Footer";

function App() {
    return (
        <div className="flex flex-col min-h-screen max-w-[780px] mx-auto px-4 md:px-5 py-8 md:py-12 text-text bg-bg">
            <Router>
                <div id="content" style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </div>
            </Router>
            <Footer />
        </div>
    );
}

export default App;
