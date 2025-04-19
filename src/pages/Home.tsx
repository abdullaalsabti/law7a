import React from "react";
import { Link } from "react-router-dom";
import { Language } from "../types";
import { getUIText } from "../utils/language";
import { mockProducts, mockArtists } from "../utils/mockData";
import ProductCard from "../components/products/ProductCard";
import ArtistCard from "../components/artist/ArtistCard";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

interface HomeProps {
  language: Language;
}

const Home: React.FC<HomeProps> = ({ language }) => {
  // Get authentication context
  const { currentUser, isAuthenticated } = useAuth();
  const isArtist = currentUser?.isArtist || false;

  // Get featured products and artists
  const featuredProducts = mockProducts.filter((product) => product.featured);
  const featuredArtists = mockArtists.filter((artist) => artist.featured);

  // Get trending products (for demo, just the most recently added)
  const trendingProducts = [...mockProducts]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">
            {language === "en"
              ? "Jordanian Art & Craftsmanship"
              : "الفن والحرف الأردنية"}
          </h1>
          <p className="hero-subtitle">
            {language === "en"
              ? "Curated collection of authentic pieces from talented artists across Jordan"
              : "مجموعة مختارة من القطع الأصيلة من الفنانين الموهوبين في جميع أنحاء الأردن"}
          </p>
          <div className="hero-cta">
            <Link to="/search" className="btn btn-primary">
              {language === "en" ? "EXPLORE COLLECTION" : "استكشف المجموعة"}
            </Link>
            {isAuthenticated && isArtist ? (
              <Link to="/profile" className="btn btn-outline">
                {language === "en" ? "MANAGE YOUR COLLECTION" : "إدارة مجموعتك"}
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-outline">
                {language === "en" ? "BECOME AN ARTIST" : "كن فناناً"}
              </Link>
            )}
          </div>
        </div>
        <div className="pattern-overlay"></div>
      </section>

      {/* Featured Artworks Section */}
      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">
            {getUIText("featuredArtworks", language)}
          </h2>
          <Link to="/search?featured=true" className="view-all-link">
            {getUIText("exploreMore", language)} →
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="product-item">
              <ProductCard product={product} language={language} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title text-center">
            {language === "en" ? "Explore Categories" : "استكشاف الفئات"}
          </h2>
          <div className="categories-grid">
            <Link
              to="/search?category=painting"
              className="category-card painting"
            >
              <div className="category-content">
                <h3>{language === "en" ? "Paintings" : "لوحات فنية"}</h3>
              </div>
            </Link>
            <Link
              to="/search?category=pottery"
              className="category-card pottery"
            >
              <div className="category-content">
                <h3>{language === "en" ? "Pottery" : "فخار"}</h3>
              </div>
            </Link>
            <Link
              to="/search?category=calligraphy"
              className="category-card calligraphy"
            >
              <div className="category-content">
                <h3>{language === "en" ? "Calligraphy" : "خط عربي"}</h3>
              </div>
            </Link>
            <Link
              to="/search?category=digital"
              className="category-card digital"
            >
              <div className="category-content">
                <h3>{language === "en" ? "Digital Art" : "فن رقمي"}</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">
            {getUIText("featuredArtists", language)}
          </h2>
          <Link to="/search?type=artist" className="view-all-link">
            {getUIText("exploreMore", language)} →
          </Link>
        </div>
        <div className="artist-grid">
          {featuredArtists.map((artist) => (
            <div key={artist.id} className="artist-item">
              <ArtistCard artist={artist} language={language} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section container">
        <div className="section-header">
          <h2 className="section-title">
            {getUIText("trendingNow", language)}
          </h2>
          <Link to="/search?sort=newest" className="view-all-link">
            {getUIText("exploreMore", language)} →
          </Link>
        </div>
        <div className="product-grid">
          {trendingProducts.map((product) => (
            <div key={product.id} className="product-item">
              <ProductCard product={product} language={language} />
            </div>
          ))}
        </div>
      </section>

      {/* Community Banner */}
      <section className="community-banner">
        <div className="container">
          <div className="community-content">
            <h2>
              {language === "en"
                ? "Join the Art Community in Amman"
                : "انضم إلى مجتمع الفن في عمان"}
            </h2>
            <p>
              {language === "en"
                ? "Connect with local artists, attend exhibitions, and be part of the vibrant art scene."
                : "تواصل مع الفنانين المحليين، احضر المعارض، وكن جزءًا من المشهد الفني النابض بالحياة."}
            </p>
            <Link to="/signup" className="btn btn-primary">
              {getUIText("signup", language)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
