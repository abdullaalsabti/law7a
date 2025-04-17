import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Language,
  Product,
  Artist,
  ProductCategory,
  ProductMedium,
} from "../types";
import { getUIText, getCategoryName, getMediumName } from "../utils/language";
import { mockProducts, mockArtists } from "../utils/mockData";
import ProductCard from "../components/products/ProductCard";
import ArtistCard from "../components/artist/ArtistCard";
import "./Search.css";

interface SearchProps {
  language: Language;
}

// Helper function to parse URL query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search: React.FC<SearchProps> = ({ language }) => {
  const query = useQuery();
  const searchQuery = query.get("q") || "";
  const initialCategory = query.get("category") || "";
  const initialType = query.get("type") || "product";

  // State for results
  const [products, setProducts] = useState<Product[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for filters
  const [searchType, setSearchType] = useState<"product" | "artist">(
    initialType as "product" | "artist"
  );
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >(initialCategory ? [initialCategory as ProductCategory] : []);
  const [selectedMediums, setSelectedMediums] = useState<ProductMedium[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [currentQuery, setCurrentQuery] = useState<string>(searchQuery);

  // Available category and medium options
  const categories: ProductCategory[] = [
    "painting",
    "pottery",
    "calligraphy",
    "digital",
    "sculpture",
    "jewelry",
    "photography",
    "textile",
    "other",
  ];

  const mediums: ProductMedium[] = [
    "oil",
    "acrylic",
    "watercolor",
    "mixed_media",
    "ceramic",
    "wood",
    "metal",
    "digital",
    "clay",
    "glass",
    "fabric",
    "paper",
    "other",
  ];

  // Load initial data
  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setProducts(mockProducts);
      setArtists(mockArtists);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters whenever filters or data changes
  useEffect(() => {
    if (loading) return;

    if (searchType === "product") {
      let filtered = [...products];

      // Apply search query filter
      if (currentQuery) {
        const lowercaseQuery = currentQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.title.en.toLowerCase().includes(lowercaseQuery) ||
            product.title.ar.toLowerCase().includes(lowercaseQuery) ||
            product.description.en.toLowerCase().includes(lowercaseQuery) ||
            product.description.ar.toLowerCase().includes(lowercaseQuery) ||
            product.tags.some((tag) =>
              tag.toLowerCase().includes(lowercaseQuery)
            )
        );
      }

      // Apply category filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((product) =>
          selectedCategories.includes(product.category)
        );
      }

      // Apply medium filter
      if (selectedMediums.length > 0) {
        filtered = filtered.filter((product) =>
          selectedMediums.includes(product.medium)
        );
      }

      // Apply price range filter
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );

      setFilteredProducts(filtered);
    } else {
      // Artist filtering
      let filtered = [...artists];

      // Apply search query filter
      if (currentQuery) {
        const lowercaseQuery = currentQuery.toLowerCase();
        filtered = filtered.filter(
          (artist) =>
            artist.name.en.toLowerCase().includes(lowercaseQuery) ||
            artist.name.ar.toLowerCase().includes(lowercaseQuery) ||
            artist.bio.en.toLowerCase().includes(lowercaseQuery) ||
            artist.bio.ar.toLowerCase().includes(lowercaseQuery) ||
            artist.tags.some((tag) =>
              tag.toLowerCase().includes(lowercaseQuery)
            )
        );
      }

      setFilteredArtists(filtered);
    }
  }, [
    loading,
    currentQuery,
    selectedCategories,
    selectedMediums,
    priceRange,
    searchType,
    products,
    artists,
  ]);

  const handleCategoryChange = (category: ProductCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleMediumChange = (medium: ProductMedium) => {
    if (selectedMediums.includes(medium)) {
      setSelectedMediums(selectedMediums.filter((m) => m !== medium));
    } else {
      setSelectedMediums([...selectedMediums, medium]);
    }
  };

  const handlePriceRangeChange = (type: "min" | "max", value: number) => {
    if (type === "min") {
      setPriceRange({ ...priceRange, min: value });
    } else {
      setPriceRange({ ...priceRange, max: value });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedMediums([]);
    setPriceRange({ min: 0, max: 1000 });
    setCurrentQuery(searchQuery); // Reset to URL query if any
  };

  if (loading) {
    return <div className="loading">{getUIText("loading", language)}</div>;
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <aside className="filter-sidebar">
          <div className="filter-header">
            <h2>{getUIText("filters", language)}</h2>
            <button onClick={handleResetFilters} className="reset-filters-btn">
              {getUIText("resetFilters", language)}
            </button>
          </div>

          <div className="filter-section">
            <h3>{language === "en" ? "Type" : "النوع"}</h3>
            <div className="type-selector">
              <button
                className={`type-btn ${
                  searchType === "product" ? "active" : ""
                }`}
                onClick={() => setSearchType("product")}
              >
                {language === "en" ? "Products" : "المنتجات"}
              </button>
              <button
                className={`type-btn ${
                  searchType === "artist" ? "active" : ""
                }`}
                onClick={() => setSearchType("artist")}
              >
                {language === "en" ? "Artists" : "الفنانين"}
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>{getUIText("search", language)}</h3>
            <input
              type="text"
              className="search-input"
              placeholder={language === "en" ? "Search..." : "بحث..."}
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
            />
          </div>

          {searchType === "product" && (
            <>
              <div className="filter-section">
                <h3>{getUIText("categories", language)}</h3>
                <div className="checkbox-group">
                  {categories.map((category) => (
                    <label key={category} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span>{getCategoryName(category, language)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>{getUIText("medium", language)}</h3>
                <div className="checkbox-group">
                  {mediums.map((medium) => (
                    <label key={medium} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedMediums.includes(medium)}
                        onChange={() => handleMediumChange(medium)}
                      />
                      <span>{getMediumName(medium, language)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>{getUIText("priceRange", language)}</h3>
                <div className="price-range">
                  <div className="range-inputs">
                    <input
                      type="number"
                      min="0"
                      max={priceRange.max}
                      value={priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange("min", Number(e.target.value))
                      }
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min={priceRange.min}
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="range-slider">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange("min", Number(e.target.value))
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        <main className="search-results">
          <div className="results-header">
            <h1 className="results-title">
              {searchType === "product"
                ? language === "en"
                  ? "Products"
                  : "المنتجات"
                : language === "en"
                ? "Artists"
                : "الفنانين"}
            </h1>
            <p className="results-count">
              {searchType === "product"
                ? `${filteredProducts.length} ${
                    language === "en" ? "products found" : "منتج تم العثور عليه"
                  }`
                : `${filteredArtists.length} ${
                    language === "en" ? "artists found" : "فنان تم العثور عليهم"
                  }`}
            </p>
          </div>

          {searchType === "product" ? (
            filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <ProductCard product={product} language={language} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>{getUIText("noResults", language)}</p>
              </div>
            )
          ) : filteredArtists.length > 0 ? (
            <div className="artist-grid">
              {filteredArtists.map((artist) => (
                <div key={artist.id} className="artist-item">
                  <ArtistCard artist={artist} language={language} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>{getUIText("noResults", language)}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
