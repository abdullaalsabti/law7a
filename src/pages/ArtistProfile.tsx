import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Language, Artist, Product } from "../types";
import { getTextByLanguage, getUIText } from "../utils/language";
import { mockArtists, mockProducts } from "../utils/mockData";
import ProductCard from "../components/products/ProductCard";
import "./ArtistProfile.css";

interface ArtistProfileProps {
  language: Language;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistProducts, setArtistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchArtistData = () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          const foundArtist = mockArtists.find((a) => a.id === id);

          if (!foundArtist) {
            setError(true);
            return;
          }

          setArtist(foundArtist);

          // Get artist's products
          const products = mockProducts.filter(
            (p) => p.artistId === foundArtist.id
          );
          setArtistProducts(products);

          setLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error fetching artist data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (loading) {
    return <div className="loading">{getUIText("loading", language)}</div>;
  }

  if (error || !artist) {
    return (
      <div className="error-container">
        <h2>{getUIText("error", language)}</h2>
        <p>
          {language === "en"
            ? "The artist you are looking for could not be found."
            : "لم يتم العثور على الفنان الذي تبحث عنه."}
        </p>
        <Link to="/" className="btn btn-primary">
          {getUIText("home", language)}
        </Link>
      </div>
    );
  }

  return (
    <div className="artist-profile-page">
      <div className="artist-cover-image">
        {artist.coverImage && <img src={artist.coverImage} alt="" />}
        <div className="artist-cover-overlay"></div>
      </div>

      <div className="artist-profile-container">
        <div className="artist-header">
          <div className="artist-profile-image">
            <img
              src={artist.profilePicture}
              alt={getTextByLanguage(artist.name, language)}
            />
          </div>
          <div className="artist-info">
            <h1 className="artist-name">
              {getTextByLanguage(artist.name, language)}
            </h1>
            <p className="artist-location">
              {getTextByLanguage(artist.location, language)}
            </p>
            <div className="artist-tags">
              {artist.tags.map((tag, index) => (
                <span key={index} className="artist-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="artist-bio-section">
          <h2 className="section-title">{getUIText("bio", language)}</h2>
          <p className="artist-bio">
            {getTextByLanguage(artist.bio, language)}
          </p>
        </div>

        <div className="artist-social-links">
          {artist.socialLinks.instagram && (
            <a
              href={artist.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Instagram"
            >
              <i>📸</i>
            </a>
          )}
          {artist.socialLinks.facebook && (
            <a
              href={artist.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Facebook"
            >
              <i>👤</i>
            </a>
          )}
          {artist.socialLinks.twitter && (
            <a
              href={artist.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter"
              aria-label="Twitter"
            >
              <i>🐦</i>
            </a>
          )}
          {artist.socialLinks.website && (
            <a
              href={artist.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link website"
              aria-label="Website"
            >
              <i>🌐</i>
            </a>
          )}
        </div>

        <div className="artist-products-section">
          <h2 className="section-title">{getUIText("artworks", language)}</h2>

          {artistProducts.length > 0 ? (
            <div className="product-grid">
              {artistProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <ProductCard product={product} language={language} />
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products">
              {language === "en"
                ? "This artist has no products available at the moment."
                : "لا يوجد منتجات متاحة لهذا الفنان في الوقت الحالي."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
