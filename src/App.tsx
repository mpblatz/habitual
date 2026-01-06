import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Footer from "./components/layout/Footer";

function App() {
    return (
        <div className="flex flex-col min-h-screen max-w-[800px] px-10 m-auto text-t-primary bg-b-primary dark:text-dt-primary dark:bg-db-primary">
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
