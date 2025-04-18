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
import { searchProducts, searchArtists } from "../firebase/search";
import ProductCard from "../components/products/ProductCard";
import ArtistCard from "../components/artist/ArtistCard";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
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
  const searchQuery = query.get("q") ?? "";
  const initialCategory = query.get("category") ?? "";
  const initialType = query.get("type") ?? "product";

  // State for results
  const [products, setProducts] = useState<Product[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastProductDoc, setLastProductDoc] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >(undefined);
  const [lastArtistDoc, setLastArtistDoc] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >(undefined);

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

  // State for expanded checkbox lists
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const [showAllMediums, setShowAllMediums] = useState<boolean>(false);



  // Load initial data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (searchType === "product") {
          // Log the query parameters for debugging
          console.log("Searching products with:", {
            query: currentQuery,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            mediums: selectedMediums.length > 0 ? selectedMediums : undefined,
            priceRange
          });

          const { products: fetchedProducts, lastDoc } = await searchProducts(
            currentQuery || undefined, // Pass undefined instead of empty string
            selectedCategories.length > 0 ? selectedCategories : undefined,
            selectedMediums.length > 0 ? selectedMediums : undefined,
            priceRange.min === 0 && priceRange.max === 1000 ? undefined : priceRange, // Don't filter by price if using default range
            undefined,
            itemsPerPage
          );

          console.log(`Found ${fetchedProducts.length} products`);
          setProducts(fetchedProducts);
          setLastProductDoc(lastDoc || undefined);
          setHasMore(fetchedProducts.length === itemsPerPage);
        } else {
          console.log("Searching artists with:", {
            query: currentQuery
          });

          const { artists: fetchedArtists, lastDoc } = await searchArtists(
            currentQuery || undefined, // Pass undefined instead of empty string
            undefined,
            itemsPerPage
          );

          console.log(`Found ${fetchedArtists.length} artists`);
          setArtists(fetchedArtists);
          setLastArtistDoc(lastDoc || undefined);
          setHasMore(fetchedArtists.length === itemsPerPage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    searchType,
    currentQuery,
    selectedCategories,
    selectedMediums,
    priceRange,
    itemsPerPage,
  ]);

  // Load more data when user reaches the end of the list
  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      if (searchType === "product") {
        console.log("Loading more products with:", {
          query: currentQuery,
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          mediums: selectedMediums.length > 0 ? selectedMediums : undefined,
          priceRange,
          lastDoc: lastProductDoc ? "exists" : "undefined"
        });

        const { products: moreProducts, lastDoc } = await searchProducts(
          currentQuery || undefined, // Pass undefined instead of empty string
          selectedCategories.length > 0 ? selectedCategories : undefined,
          selectedMediums.length > 0 ? selectedMediums : undefined,
          priceRange.min === 0 && priceRange.max === 1000 ? undefined : priceRange, // Don't filter by price if using default range
          lastProductDoc,
          itemsPerPage
        );

        console.log(`Loaded ${moreProducts.length} more products`);
        setProducts([...products, ...moreProducts]);
        setLastProductDoc(lastDoc || undefined);
        setHasMore(moreProducts.length === itemsPerPage);
      } else {
        console.log("Loading more artists with:", {
          query: currentQuery,
          lastDoc: lastArtistDoc ? "exists" : "undefined"
        });

        const { artists: moreArtists, lastDoc } = await searchArtists(
          currentQuery || undefined, // Pass undefined instead of empty string
          lastArtistDoc,
          itemsPerPage
        );

        console.log(`Loaded ${moreArtists.length} more artists`);
        setArtists([...artists, ...moreArtists]);
        setLastArtistDoc(lastDoc || undefined);
        setHasMore(moreArtists.length === itemsPerPage);
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentQuery(searchQuery);
    // Reset pagination
    setLastProductDoc(undefined);
    setLastArtistDoc(undefined);
    setHasMore(true);
    setCurrentPage(1);
    // Reset products/artists to empty to show loading state
    setProducts([]);
    setArtists([]);
  };

  // Handle search type change
  const handleSearchTypeChange = (type: "product" | "artist") => {
    setSearchType(type);
    // Reset pagination
    setLastProductDoc(undefined);
    setLastArtistDoc(undefined);
    setHasMore(true);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (category: ProductCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    // Reset pagination
    setLastProductDoc(undefined);
    setHasMore(true);
    setCurrentPage(1);
  };

  // Handle medium change
  const handleMediumChange = (medium: ProductMedium) => {
    if (selectedMediums.includes(medium)) {
      setSelectedMediums(selectedMediums.filter((m) => m !== medium));
    } else {
      setSelectedMediums([...selectedMediums, medium]);
    }
    // Reset pagination
    setLastProductDoc(undefined);
    setHasMore(true);
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceRangeChange = (type: "min" | "max", value: number) => {
    if (type === "min") {
      setPriceRange({ ...priceRange, min: value });
    } else {
      setPriceRange({ ...priceRange, max: value });
    }
    // Reset pagination
    setLastProductDoc(undefined);
    setHasMore(true);
    setCurrentPage(1);
  };

  // Calculate pagination info for display
  const totalItems =
    searchType === "product" ? products.length : artists.length;

  // Show loading state for initial load
  if (loading && products.length === 0 && artists.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{getUIText("loading", language)}</p>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <aside className="filter-sidebar">
          <div className="filter-header">
            <h2>{getUIText("filters", language)}</h2>
            <button 
              onClick={() => {
                setSelectedCategories([]);
                setSelectedMediums([]);
                setPriceRange({ min: 0, max: 1000 });
                setCurrentQuery("");
                setCurrentPage(1);
              }} 
              className="reset-filters-btn"
            >
              {getUIText("resetFilters", language)}
            </button>
          </div>

          <div className="filter-section">
            <h3>{language === "en" ? "Type" : "النوع"}</h3>
            <div className="type-selector">
              <button
                className={`type-btn ${searchType === "product" ? "active" : ""}`}
                onClick={() => handleSearchTypeChange("product")}
              >
                {language === "en" ? "Products" : "المنتجات"}
              </button>
              <button
                className={`type-btn ${searchType === "artist" ? "active" : ""}`}
                onClick={() => handleSearchTypeChange("artist")}
              >
                {language === "en" ? "Artists" : "الفنانين"}
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>{getUIText("search", language)}</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder={language === "en" ? "Search..." : "بحث..."}
                value={searchQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                {getUIText("search", language)}
              </button>
            </form>
          </div>

          {searchType === "product" && (
            <>
              <div className="filter-section">
                <h3>{getUIText("categories", language)}</h3>
                <div className="checkbox-group">
                  {[
                    "painting",
                    "pottery",
                    "calligraphy",
                    "digital",
                    "sculpture",
                    "photography"
                  ].slice(0, showAllCategories ? 6 : 4).map((category) => (
                    <label key={category} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category as ProductCategory)}
                        onChange={() => handleCategoryChange(category as ProductCategory)}
                        id={`category-${category}`}
                      />
                      <span title={getCategoryName(category as ProductCategory, language)}>
                        {getCategoryName(category as ProductCategory, language)}
                      </span>
                    </label>
                  ))}
                </div>
                <button 
                  className="show-more-btn" 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories 
                    ? language === "en" ? "Show Less" : "عرض أقل" 
                    : language === "en" ? "Show All Categories" : "عرض جميع الفئات"}
                </button>
              </div>

              <div className="filter-section">
                <h3>{getUIText("medium", language)}</h3>
                <div className="checkbox-group">
                  {[
                    "oil",
                    "acrylic",
                    "watercolor",
                    "mixed_media",
                    "ceramic",
                    "digital"
                  ].slice(0, showAllMediums ? 6 : 4).map((medium) => (
                    <label key={medium} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedMediums.includes(medium as ProductMedium)}
                        onChange={() => handleMediumChange(medium as ProductMedium)}
                        id={`medium-${medium}`}
                      />
                      <span title={getMediumName(medium as ProductMedium, language)}>
                        {getMediumName(medium as ProductMedium, language)}
                      </span>
                    </label>
                  ))}
                </div>
                <button 
                  className="show-more-btn" 
                  onClick={() => setShowAllMediums(!showAllMediums)}
                >
                  {showAllMediums 
                    ? language === "en" ? "Show Less" : "عرض أقل" 
                    : language === "en" ? "Show All Mediums" : "عرض جميع الوسائط"}
                </button>
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
                      aria-label={language === "en" ? "Minimum price" : "الحد الأدنى للسعر"}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min={priceRange.min}
                      value={priceRange.max}
                      onChange={(e) =>
                        handlePriceRangeChange("max", Number(e.target.value))
                      }
                      aria-label={language === "en" ? "Maximum price" : "الحد الأقصى للسعر"}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        <main className="search-results-container">
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
                ? `${products.length} ${language === "en" ? "products found" : "منتج تم العثور عليه"}`
                : `${artists.length} ${language === "en" ? "artists found" : "فنان تم العثور عليهم"}`}
            </p>
          </div>

          <div className="search-results">
        {searchType === "product" ? (
          products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                  />
                ))}

                {/* Load more section */}
                {loading && (
                  <div className="loading-more">
                    <div className="loading-spinner"></div>
                  </div>
                )}

                {hasMore && !loading && (
                  <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>
                      {getUIText("loadMore", language)}
                    </button>
                  </div>
                )}
              </div>

              <div className="search-results-info">
                <span>
                  {getUIText("showing", language)} {totalItems}{" "}
                  {getUIText("items", language)}
                </span>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>{getUIText("noProductsFound", language)}</p>
            </div>
          )
        ) : artists.length > 0 ? (
          <>
            <div className="artist-grid">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  language={language}
                />
              ))}

              {/* Load more section */}
              {loading && (
                <div className="loading-more">
                  <div className="loading-spinner"></div>
                </div>
              )}

              {hasMore && !loading && (
                <div className="load-more-container">
                  <button className="load-more-btn" onClick={loadMore}>
                    {getUIText("loadMore", language)}
                  </button>
                </div>
              )}
            </div>

            <div className="search-results-info">
              <span>
                {getUIText("showing", language)} {totalItems}{" "}
                {getUIText("items", language)}
              </span>
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>{getUIText("noArtistsFound", language)}</p>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
