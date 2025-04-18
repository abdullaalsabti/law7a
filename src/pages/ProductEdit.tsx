import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Language, ProductCategory, ProductMedium } from "../types";
import { getUIText } from "../utils/language";
import { useAuth } from "../context/AuthContext";
import { getProductById, saveProduct } from "../firebase/products";
import { getArtistByUserId, createArtistProfile } from "../firebase/artists";
import "./ProductEdit.css";

interface ProductEditProps {
  language: Language;
}

const ProductEdit: React.FC<ProductEditProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isNewProduct = id === "new";

  // Form state
  const [formData, setFormData] = useState<{
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    price: number;
    category: ProductCategory;
    medium: ProductMedium;
    images: string[];
    dimensions: {
      width: number;
      height: number;
      depth?: number;
      unit: "cm" | "in";
    };
    inStock: boolean;
    quantity: number;
    featured: boolean;
    tags: string[];
  }>({
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    price: 0,
    category: "painting",
    medium: "acrylic",
    images: [""],
    dimensions: {
      width: 0,
      height: 0,
      unit: "cm",
    },
    inStock: true,
    quantity: 1,
    featured: false,
    tags: [],
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  // Fetch product data if editing existing product
  useEffect(() => {
    if (!currentUser?.isArtist) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get artist data or create a new artist profile if one doesn't exist
        let artistData = await getArtistByUserId(currentUser.id);
        
        if (!artistData) {
          try {
            // Create a new artist profile with default values
            artistData = await createArtistProfile(
              currentUser.id,
              { en: currentUser.name || "Artist", ar: currentUser.name || "فنان" },
              { en: "", ar: "" },
              { en: "", ar: "" },
              currentUser.profilePicture,
              []
            );
          } catch (err) {
            console.error("Error creating artist profile:", err);
            setError("Could not create artist profile");
            setLoading(false);
            return;
          }
        }
        
        if (!isNewProduct && id) {
          // Fetch product data from Firebase
          const product = await getProductById(id);

          if (!product) {
            setError("Product not found");
            setLoading(false);
            return;
          }

          // Check if the current user is the artist of this product
          if (product.artistId !== artistData.id) {
            setError("You don't have permission to edit this product");
            setLoading(false);
            return;
          }

          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            medium: product.medium,
            images: product.images,
            dimensions: product.dimensions ?? {
              width: 0,
              height: 0,
              unit: "cm"
            },
            inStock: product.inStock,
            quantity: product.quantity ?? 1,
            featured: product.featured,
            tags: product.tags ?? [],
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while loading the data");
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, id, isNewProduct, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle nested properties (e.g., title.en, title.ar)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        // Create a safe copy of the nested object
        const parentObj = prev[parent as keyof typeof prev] as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value,
          },
        };
      });
      return;
    }
    if (name === "price" || name === "quantity") {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) : value,
      }));
    } else if (name === "width" || name === "height" || name === "depth") {
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [name]: parseFloat(value),
        },
      }));
    } else if (name === "inStock" || name === "featured") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = value;
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.en || !formData.title.ar) {
      setError("Title is required in both languages");
      return;
    }

    if (!formData.description.en || !formData.description.ar) {
      setError("Description is required in both languages");
      return;
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (formData.images.some(img => !img)) {
      setError("All image URLs must be filled");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Check if user is logged in
      if (!currentUser) {
        setError("You must be logged in to save a product");
        setLoading(false);
        return;
      }
      
      // Get artist data or create a new artist profile if one doesn't exist
      let artistData = await getArtistByUserId(currentUser.id);
      
      if (!artistData) {
        try {
          // Create a new artist profile with default values
          artistData = await createArtistProfile(
            currentUser.id,
            { en: currentUser.name || "Artist", ar: currentUser.name || "فنان" },
            { en: "", ar: "" },
            { en: "", ar: "" },
            currentUser.profilePicture,
            []
          );
        } catch (err) {
          console.error("Error creating artist profile:", err);
          setError("Could not create artist profile");
          setLoading(false);
          return;
        }
      }
      
      // Save product to Firebase
      const productData = {
        artistId: artistData.id,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: "JOD",
        category: formData.category,
        medium: formData.medium,
        dimensions: formData.dimensions,
        inStock: formData.inStock,
        quantity: formData.quantity,
        featured: formData.featured,
        dateCreated: new Date().toISOString(),
        tags: formData.tags,
      };
      
      await saveProduct(
        isNewProduct ? undefined : id,
        productData,
        formData.images
      );
      
      // Navigate back to profile page after successful save
      navigate("/profile");
    } catch (err) {
      console.error("Error saving product:", err);
      setError("An error occurred while saving the product");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        {getUIText("loading", language)}
      </div>
    );
  }

  return (
    <div className="product-edit-page">
      <div className="product-edit-header">
        <h1 className="page-title">
          {isNewProduct
            ? getUIText("addNewProduct", language)
            : getUIText("editProduct", language)}
        </h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form className="product-edit-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">{getUIText("basicInfo", language)}</h2>
          
          <div className="form-group">
            <label htmlFor="title-en">{getUIText("titleEn", language)}</label>
            <input
              type="text"
              id="title-en"
              name="title.en"
              value={formData.title.en}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title-ar">{getUIText("titleAr", language)}</label>
            <input
              type="text"
              id="title-ar"
              name="title.ar"
              value={formData.title.ar}
              onChange={handleInputChange}
              required
              dir="rtl"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description-en">{getUIText("descriptionEn", language)}</label>
            <textarea
              id="description-en"
              name="description.en"
              value={formData.description.en}
              onChange={handleInputChange}
              required
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description-ar">{getUIText("descriptionAr", language)}</label>
            <textarea
              id="description-ar"
              name="description.ar"
              value={formData.description.ar}
              onChange={handleInputChange}
              required
              rows={4}
              dir="rtl"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">{getUIText("price", language)}</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">{getUIText("category", language)}</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="painting">{getUIText("painting", language)}</option>
                <option value="sculpture">{getUIText("sculpture", language)}</option>
                <option value="photography">{getUIText("photography", language)}</option>
                <option value="digital">{getUIText("digital", language)}</option>
                <option value="pottery">{getUIText("pottery", language)}</option>
                <option value="calligraphy">{getUIText("calligraphy", language)}</option>
                <option value="mixed_media">{getUIText("mixedMedia", language)}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="medium">{getUIText("medium", language)}</label>
              <select
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={handleInputChange}
                required
              >
                <option value="oil">{getUIText("oil", language)}</option>
                <option value="acrylic">{getUIText("acrylic", language)}</option>
                <option value="watercolor">{getUIText("watercolor", language)}</option>
                <option value="pencil">{getUIText("pencil", language)}</option>
                <option value="charcoal">{getUIText("charcoal", language)}</option>
                <option value="digital">{getUIText("digital", language)}</option>
                <option value="mixed_media">{getUIText("mixedMedia", language)}</option>
                <option value="ceramic">{getUIText("ceramic", language)}</option>
                <option value="paper">{getUIText("paper", language)}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">{getUIText("images", language)}</h2>
          
          {formData.images.map((image, index) => (
            <div className="form-group image-input-group" key={`image-${index}`}>
              <div className="image-input-container">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={getUIText("imageUrlPlaceholder", language)}
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
              {image && (
                <div className="image-preview">
                  <img src={image} alt={`Product ${index + 1}`} />
                </div>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-image-btn"
            onClick={handleAddImage}
          >
            <span>+</span> {getUIText("addImage", language)}
          </button>
        </div>

        <div className="form-section">
          <h2 className="section-title">{getUIText("dimensions", language)}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="width">{getUIText("width", language)}</label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.dimensions.width}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">{getUIText("height", language)}</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.dimensions.height}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="depth">{getUIText("depth", language)}</label>
              <input
                type="number"
                id="depth"
                name="depth"
                value={formData.dimensions.depth || 0}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unit">{getUIText("unit", language)}</label>
              <select
                id="unit"
                name="unit"
                value={formData.dimensions.unit}
                onChange={handleInputChange}
                required
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">{getUIText("inventory", language)}</h2>
          
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label htmlFor="inStock" className="checkbox-label">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                />
                {getUIText("inStock", language)}
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">{getUIText("quantity", language)}</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity ?? 1}
                onChange={handleInputChange}
                min="1"
                disabled={!formData.inStock}
                placeholder={getUIText("productQuantityPlaceholder", language) ?? "1"}
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="featured" className="checkbox-label">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                {getUIText("featured", language)}
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">{getUIText("tags", language)}</h2>
          
          <div className="form-group">
            <label htmlFor="tag-input">{getUIText("addTags", language)}</label>
            <div className="tag-input-container">
              <input
                type="text"
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                className="add-tag-btn"
                onClick={handleAddTag}
              >
                +
              </button>
            </div>
          </div>

          <div className="tags-container">
            {formData.tags.map((tag) => (
              <div key={tag} className="tag">
                {tag}
                <span
                  className="tag-remove"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/profile")}
          >
            {getUIText("cancel", language)}
          </button>
          <button type="submit" className="submit-btn">
            {isNewProduct
              ? getUIText("createProduct", language)
              : getUIText("saveChanges", language)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
