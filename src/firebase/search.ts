import { 
  collection, 
  query, 
  getDocs, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "./config";
import { Artist, Product, ProductCategory, ProductMedium } from "../types";

/**
 * Search for products in Firestore with various filters
 */
export const searchProducts = async (
  searchQuery?: string,
  categories?: ProductCategory[],
  mediums?: ProductMedium[],
  priceRange?: { min: number; max: number },
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  itemsPerPage: number = 12
): Promise<{ products: Product[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    console.log("Starting product search with params:", { searchQuery, categories, mediums, priceRange });
    
    const productsRef = collection(db, "products");
    let constraints: any[] = [];
    
    // Add pagination - don't use any other constraints initially to ensure we get results
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    constraints.push(limit(itemsPerPage));
    
    // Execute query
    console.log("Executing Firestore query with constraints:", constraints.length);
    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    console.log(`Raw query returned ${querySnapshot.docs.length} documents`);
    
    // Convert to Product objects
    let products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Processing document ${doc.id}:`, data);
      
      return {
        id: doc.id,
        artistId: data.artistId || "",
        title: data.title || { en: "", ar: "" },
        description: data.description || { en: "", ar: "" },
        price: data.price || 0,
        images: data.images || [],
        category: data.category || "painting",
        medium: data.medium || "other",
        dimensions: data.dimensions || { width: 0, height: 0, unit: "cm" },
        inStock: data.inStock ?? true,
        quantity: data.quantity ?? 1,
        featured: data.featured ?? false,
        tags: data.tags ?? []
      } as Product;
    });
    
    console.log(`Converted ${products.length} products`);
    
    // Apply client-side filtering
    if (priceRange) {
      products = products.filter(
        product => product.price >= priceRange.min && product.price <= priceRange.max
      );
    }
    
    // Apply client-side filtering for search queries
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      products = products.filter(
        product =>
          (product.title.en?.toLowerCase() || "").includes(lowercaseQuery) ||
          (product.title.ar?.toLowerCase() || "").includes(lowercaseQuery) ||
          (product.description.en?.toLowerCase() || "").includes(lowercaseQuery) ||
          (product.description.ar?.toLowerCase() || "").includes(lowercaseQuery) ||
          product.tags?.some(tag => (tag?.toLowerCase() || "").includes(lowercaseQuery))
      );
    }
    
    // Apply category filter client-side
    if (categories && categories.length > 0) {
      products = products.filter(product => categories.includes(product.category));
    }
    
    // Apply medium filter client-side
    if (mediums && mediums.length > 0) {
      products = products.filter(product => mediums.includes(product.medium));
    }
    
    console.log(`After filtering: ${products.length} products remain`);
    
    // Sort products by ID for consistency
    products.sort((a, b) => a.id.localeCompare(b.id));
    
    // Get the last document for pagination
    const lastVisible = querySnapshot.docs.at(-1) ?? null;
    
    return { 
      products, 
      lastDoc: lastVisible 
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/**
 * Search for artists in Firestore
 */
export const searchArtists = async (
  searchQuery?: string,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  itemsPerPage: number = 12
): Promise<{ artists: Artist[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    console.log("Starting artist search with params:", { searchQuery });
    
    const artistsRef = collection(db, "artists");
    let constraints: any[] = [];
    
    // Add pagination - minimal constraints to ensure we get results
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    constraints.push(limit(itemsPerPage));
    
    // Execute query
    console.log("Executing Firestore query with constraints:", constraints.length);
    const q = query(artistsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    console.log(`Raw query returned ${querySnapshot.docs.length} artist documents`);
    
    // Convert to Artist objects
    let artists = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Processing artist document ${doc.id}:`, data);
      
      return {
        id: doc.id,
        userId: data.userId || "",
        name: data.name || { en: "", ar: "" },
        bio: data.bio || { en: "", ar: "" },
        profilePicture: data.profilePicture || "",
        coverImage: data.coverImage || "",
        location: data.location || { city: "", country: "" },
        socialLinks: data.socialLinks ?? {},
        tags: data.tags ?? [],
        featured: data.featured ?? false
      } as Artist;
    });
    
    console.log(`Converted ${artists.length} artists`);
    
    // Apply client-side filtering for search queries
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      artists = artists.filter(
        artist =>
          (artist.name.en?.toLowerCase() || "").includes(lowercaseQuery) ||
          (artist.name.ar?.toLowerCase() || "").includes(lowercaseQuery) ||
          (artist.bio.en?.toLowerCase() || "").includes(lowercaseQuery) ||
          (artist.bio.ar?.toLowerCase() || "").includes(lowercaseQuery) ||
          artist.tags?.some(tag => (tag?.toLowerCase() || "").includes(lowercaseQuery))
      );
      
      console.log(`After search filtering: ${artists.length} artists remain`);
    }
    
    // Get the last document for pagination
    const lastVisible = querySnapshot.docs.at(-1) ?? null;
    
    return { 
      artists, 
      lastDoc: lastVisible 
    };
  } catch (error) {
    console.error("Error searching artists:", error);
    throw error;
  }
};
