import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language, Artist, Product } from "../types";
import { getTextByLanguage, getUIText } from "../utils/language";
import ProductCard from "../components/products/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getArtistByUserId } from "../firebase/artists";
import { getProductsByArtistId } from "../firebase/products";
import "./UserProfile.css";

interface UserProfileProps {
  language: Language;
}

const UserProfile: React.FC<UserProfileProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistProducts, setArtistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"profile" | "products">("profile");

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Fetch user data from Firebase
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (currentUser.isArtist) {
          // Get artist data from Firebase
          const foundArtist = await getArtistByUserId(currentUser.id);

          if (foundArtist) {
            setArtist(foundArtist);

            // Get artist's products from Firebase
            const products = await getProductsByArtistId(foundArtist.id);
            setArtistProducts(products);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="loading">{getUIText("loading", language)}</div>;
  }

  if (!currentUser) {
    return null; // This should not happen due to the redirect, but just in case
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={currentUser.profilePicture || "https://via.placeholder.com/150"}
            alt={currentUser.name}
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{currentUser.name}</h1>
          <p className="profile-email">{currentUser.email}</p>
          {artist && (
            <p className="profile-location">
              {getTextByLanguage(artist.location, language)}
            </p>
          )}
        </div>
      </div>

      {currentUser.isArtist && (
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            {getUIText("profile", language)}
          </button>
          <button
            className={`tab-button ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {getUIText("myProducts", language)}
          </button>
        </div>
      )}

      <div className="profile-content">
        {activeTab === "profile" ? (
          <div className="profile-details">
            {artist && (
              <>
                <div className="profile-section">
                  <h2 className="section-title">{getUIText("bio", language)}</h2>
                  <p className="artist-bio">
                    {getTextByLanguage(artist.bio, language)}
                  </p>
                </div>

                {artist.socialLinks && (
                  <div className="profile-section">
                    <h2 className="section-title">
                      {getUIText("socialLinks", language)}
                    </h2>
                    <div className="social-links">
                      {artist.socialLinks.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link instagram"
                        >
                          Instagram
                        </a>
                      )}
                      {artist.socialLinks.facebook && (
                        <a
                          href={artist.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link facebook"
                        >
                          Facebook
                        </a>
                      )}
                      {artist.socialLinks.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link twitter"
                        >
                          Twitter
                        </a>
                      )}
                      {artist.socialLinks.website && (
                        <a
                          href={artist.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link website"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="profile-section">
                  <h2 className="section-title">{getUIText("tags", language)}</h2>
                  <div className="artist-tags">
                    {artist.tags.map((tag, index) => (
                      <span key={index} className="artist-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="edit-profile-btn">
                    {getUIText("editProfile", language)}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="products-management">
            <div className="products-header">
              <h2 className="section-title">{getUIText("myProducts", language)}</h2>
              <Link to="/product/new" className="add-product-btn">
                {getUIText("addNewProduct", language)}
              </Link>
            </div>

            {artistProducts.length > 0 ? (
              <div className="product-management-grid">
                {artistProducts.map((product) => (
                  <div key={product.id} className="product-management-item">
                    <div className="product-card-wrapper">
                      <ProductCard product={product} language={language} />
                      <div className="product-actions">
                        <Link
                          to={`/product/${product.id}/edit`}
                          className="edit-product-btn"
                        >
                          {getUIText("edit", language)}
                        </Link>
                        <button className="delete-product-btn">
                          {getUIText("delete", language)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>
                  {language === "en"
                    ? "You haven't added any products yet."
                    : "لم تقم بإضافة أي منتجات حتى الآن."}
                </p>
                <Link to="/product/new" className="add-product-btn">
                  {getUIText("addFirstProduct", language)}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
