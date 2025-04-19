import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language, Artist, Product } from "../types";
import { getTextByLanguage, getUIText } from "../utils/language";
import ProductCard from "../components/products/ProductCard";
import { useAuth } from "../context/AuthContext";
import { getArtistByUserId, updateArtistProfile } from "../firebase/artists";
import { getProductsByArtistId } from "../firebase/products";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import "./UserProfile.css";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "../utils/uploadthing";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Social media icons
import { FaInstagram, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";
import { IconWrapper } from "../components/ui/IconWrapper";
interface UserProfileProps {
  language: Language;
}

const UserProfile: React.FC<UserProfileProps> = ({ language }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistProducts, setArtistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"profile" | "products">("profile");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedArtist, setEditedArtist] = useState<Artist | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  // Helper function to get button text based on state
  const getButtonText = () => {
    if (savingProfile) return getUIText("saving", language);
    if (isEditing) return getUIText("saveChanges", language);
    return getUIText("editProfile", language);
  };

  // Handle saving profile changes
  const handleSaveProfileChanges = async () => {
    if (!editedArtist || !artist) return;

    try {
      setSavingProfile(true);
      await updateArtistProfile(artist.id, {
        bio: editedArtist.bio,
        socialLinks: editedArtist.socialLinks,
        tags: editedArtist.tags,
      });

      // Update local state
      setArtist(editedArtist);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating artist profile:", error);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle edit button click
  const handleEditButtonClick = () => {
    if (isEditing) {
      handleSaveProfileChanges();
    } else {
      setIsEditing(true);
    }
  };

  // Fetch user data on component mount
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
            setEditedArtist(foundArtist); // Initialize edited artist state

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

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]?.url && currentUser) {
        try {
          // Update Firebase Auth profile
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
              photoURL: res[0].url,
            });
          }

          // Update Firestore user document
          const userDocRef = doc(db, "users", currentUser.id);
          await updateDoc(userDocRef, {
            profilePicture: res[0].url,
          });

          // Update artist profile if exists
          if (artist) {
            await updateArtistProfile(artist.id, {
              profilePicture: res[0].url,
            });

            setArtist((prev) =>
              prev ? { ...prev, profilePicture: res[0].url } : null
            );
            setEditedArtist((prev) =>
              prev ? { ...prev, profilePicture: res[0].url } : null
            );
          }

          toast.success(getUIText("profilePictureUpdated", language));
        } catch (error) {
          console.error("Error updating profile:", error);
          toast.error(getUIText("uploadFailed", language));
        } finally {
          setUploadingImage(false);
        }
      }
    },
    onUploadError: () => {
      toast.error(getUIText("uploadFailed", language));
      setUploadingImage(false);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: generateClientDropzoneAccept(["image/*"]),
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length || !currentUser) return;

      setUploadingImage(true);
      await startUpload(acceptedFiles);
    },
    disabled: uploadingImage,
  });

  if (authLoading || loading) {
    return <div className="loading">{getUIText("loading", language)}</div>;
  }

  if (!currentUser) {
    return null; // This should not happen due to the redirect, but just in case
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div
            {...getRootProps()}
            className={`avatar-container ${isDragActive ? "drag-active" : ""}`}
          >
            <input {...getInputProps()} />
            <img
              src={
                currentUser.profilePicture
                  ? `${currentUser.profilePicture}?t=${new Date().getTime()}`
                  : "https://via.placeholder.com/150"
              }
              alt={currentUser.name}
              className="profile-image"
            />
            <div className="avatar-edit-overlay">
              <span className="edit-icon">{uploadingImage ? "⏳" : "📷"}</span>
            </div>
            {uploadingImage && (
              <div className="upload-progress">
                <span>Uploading...</span>
              </div>
            )}
          </div>
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
                  <h2 className="section-title">
                    {getUIText("bio", language)}
                  </h2>
                  {isEditing ? (
                    <div className="edit-bio-container">
                      <div className="language-tabs">
                        <button className="lang-tab active">English</button>
                        <button className="lang-tab">Arabic</button>
                      </div>
                      <textarea
                        className="bio-editor"
                        value={editedArtist?.bio.en}
                        onChange={(e) => {
                          if (editedArtist) {
                            setEditedArtist({
                              ...editedArtist,
                              bio: {
                                ...editedArtist.bio,
                                en: e.target.value,
                              },
                            });
                          }
                        }}
                        placeholder="Enter your bio in English"
                      />
                    </div>
                  ) : (
                    <p className="artist-bio">
                      {getTextByLanguage(artist.bio, language)}
                    </p>
                  )}
                </div>

                <div className="profile-section">
                  <h2 className="section-title">
                    {getUIText("socialLinks", language)}
                  </h2>
                  {isEditing ? (
                    <div className="edit-social-links">
                      <div className="social-link-input">
                        <label htmlFor="instagram">
                          <IconWrapper icon={FaInstagram} size={20} /> Instagram
                        </label>
                        <input
                          type="text"
                          id="instagram"
                          placeholder="Instagram URL"
                          value={editedArtist?.socialLinks?.instagram ?? ""}
                          onChange={(e) => {
                            if (editedArtist) {
                              setEditedArtist({
                                ...editedArtist,
                                socialLinks: {
                                  ...editedArtist.socialLinks,
                                  instagram: e.target.value,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="social-link-input">
                        <label htmlFor="facebook">
                          <IconWrapper icon={FaFacebook} size={20} /> Facebook
                        </label>
                        <input
                          type="text"
                          id="facebook"
                          placeholder="Facebook URL"
                          value={editedArtist?.socialLinks?.facebook ?? ""}
                          onChange={(e) => {
                            if (editedArtist) {
                              setEditedArtist({
                                ...editedArtist,
                                socialLinks: {
                                  ...editedArtist.socialLinks,
                                  facebook: e.target.value,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="social-link-input">
                        <label htmlFor="twitter">
                          <IconWrapper icon={FaTwitter} size={20} /> Twitter
                        </label>
                        <input
                          type="text"
                          id="twitter"
                          placeholder="Twitter URL"
                          value={editedArtist?.socialLinks?.twitter ?? ""}
                          onChange={(e) => {
                            if (editedArtist) {
                              setEditedArtist({
                                ...editedArtist,
                                socialLinks: {
                                  ...editedArtist.socialLinks,
                                  twitter: e.target.value,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="social-link-input">
                        <label htmlFor="website">
                          <IconWrapper icon={FaGlobe} size={20} /> Website
                        </label>
                        <input
                          type="text"
                          id="website"
                          placeholder="Website URL"
                          value={editedArtist?.socialLinks?.website ?? ""}
                          onChange={(e) => {
                            if (editedArtist) {
                              setEditedArtist({
                                ...editedArtist,
                                socialLinks: {
                                  ...editedArtist.socialLinks,
                                  website: e.target.value,
                                },
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="social-links">
                      {artist.socialLinks?.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link instagram"
                          aria-label="Instagram"
                          title="Instagram"
                        >
                          <IconWrapper icon={FaInstagram} size={24} />
                        </a>
                      )}
                      {artist.socialLinks?.facebook && (
                        <a
                          href={artist.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link facebook"
                          aria-label="Facebook"
                          title="Facebook"
                        >
                          <IconWrapper icon={FaFacebook} size={24} />
                        </a>
                      )}
                      {artist.socialLinks?.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link twitter"
                          aria-label="Twitter"
                          title="Twitter"
                        >
                          <IconWrapper icon={FaTwitter} size={24} />
                        </a>
                      )}
                      {artist.socialLinks?.website && (
                        <a
                          href={artist.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link website"
                          aria-label="Website"
                          title="Website"
                        >
                          <IconWrapper icon={FaGlobe} size={24} />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="profile-section">
                  <h2 className="section-title">
                    {getUIText("tags", language)}
                  </h2>
                  {isEditing ? (
                    <div className="edit-tags-container">
                      <input
                        type="text"
                        className="tags-editor"
                        placeholder="Enter tags separated by commas"
                        value={editedArtist?.tags.join(", ")}
                        onChange={(e) => {
                          if (editedArtist) {
                            const tagsArray = e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag !== "");
                            setEditedArtist({
                              ...editedArtist,
                              tags: tagsArray,
                            });
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="artist-tags">
                      {artist.tags.map((tag, tagId) => (
                        <span
                          key={`tag-${tagId}-${tag}`}
                          className="artist-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  <button
                    className="edit-profile-btn"
                    onClick={handleEditButtonClick}
                    disabled={savingProfile || uploadingImage}
                  >
                    {getButtonText()}
                  </button>
                  {isEditing && (
                    <button
                      className="cancel-edit-btn"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedArtist(artist); // Reset to original
                      }}
                      disabled={savingProfile || uploadingImage}
                    >
                      {getUIText("cancel", language)}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="products-management">
            <div className="products-header">
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserProfile;
