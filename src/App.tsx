import HomePage from "./pages/HomePage";
import Footer from "./components/layout/Footer";

function App() {
    return (
        <div className="flex flex-col min-h-screen max-w-[780px] mx-auto px-4 md:px-5 py-8 md:py-12 text-text bg-bg">
            <div id="content" style={{ flex: 1 }}>
                <HomePage />
            </div>
            <Footer />
        </div>
    );
}

export default App;
