import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import ArtistProfile from "./pages/ArtistProfile";
import ProductPage from "./pages/ProductPage";
import Search from "./pages/Search";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { useState } from "react";

function App() {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
    document.documentElement.dir = language === "en" ? "rtl" : "ltr";
    document.documentElement.lang = language === "en" ? "ar" : "en";
  };

  return (
    <Router>
      <div className={`app ${language === "ar" ? "rtl" : "ltr"}`}>
        <Header language={language} toggleLanguage={toggleLanguage} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route
              path="/artist/:id"
              element={<ArtistProfile language={language} />}
            />
            <Route
              path="/product/:id"
              element={<ProductPage language={language} />}
            />
            <Route path="/search" element={<Search language={language} />} />
            <Route path="/login" element={<Login language={language} />} />
            <Route path="/signup" element={<SignUp language={language} />} />
            <Route path="/cart" element={<Cart language={language} />} />
            <Route
              path="/checkout"
              element={<Checkout language={language} />}
            />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
