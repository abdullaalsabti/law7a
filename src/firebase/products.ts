import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  setDoc,
  deleteDoc,
  DocumentSnapshot
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "./config";
import { Product, ProductCategory, ProductMedium } from "../types";

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    
    return productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        artistId: data.artistId,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        images: data.images,
        category: data.category,
        medium: data.medium,
        dimensions: data.dimensions,
        weight: data.weight,
        inStock: data.inStock,
        quantity: data.quantity,
        featured: data.featured,
        dateCreated: data.dateCreated,
        dateAdded: data.dateAdded,
        tags: data.tags || []
      };
    });
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

// Get products with pagination
export const getProductsPaginated = async (
  pageSize: number = 12,
  lastVisible?: DocumentSnapshot
): Promise<{ products: Product[], lastVisible: DocumentSnapshot | null }> => {
  try {
    const productsCollection = collection(db, "products");
    let q = query(
      productsCollection,
      orderBy("dateAdded", "desc"),
      limit(pageSize)
    );
    
    if (lastVisible) {
      q = query(
        productsCollection,
        orderBy("dateAdded", "desc"),
        startAfter(lastVisible),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(q);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        artistId: data.artistId,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        images: data.images,
        category: data.category,
        medium: data.medium,
        dimensions: data.dimensions,
        weight: data.weight,
        inStock: data.inStock,
        quantity: data.quantity,
        featured: data.featured,
        dateCreated: data.dateCreated,
        dateAdded: data.dateAdded,
        tags: data.tags || []
      };
    });
    
    return { products, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error("Error getting paginated products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product with ID: ${id}`);
    const productDoc = await getDoc(doc(db, "products", id));
    
    if (productDoc.exists()) {
      const data = productDoc.data();
      console.log(`Found product:`, data);
      
      return {
        id: productDoc.id,
        artistId: data.artistId,
        title: data.title || { en: "", ar: "" },
        description: data.description || { en: "", ar: "" },
        price: data.price || 0,
        currency: data.currency ?? "JOD",
        images: data.images || [],
        category: data.category || "painting",
        medium: data.medium || "other",
        dimensions: data.dimensions || { width: 0, height: 0, unit: "cm" },
        weight: data.weight,
        inStock: data.inStock ?? true,
        quantity: data.quantity ?? 1,
        featured: data.featured ?? false,
        dateCreated: data.dateCreated || new Date().toISOString(),
        dateAdded: data.dateAdded || new Date().toISOString(),
        tags: data.tags ?? []
      };
    }
    
    console.log(`Product with ID ${id} not found`);
    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null; // Return null instead of throwing error
  }
};

// Get products by artist ID
export const getProductsByArtistId = async (artistId: string): Promise<Product[]> => {
  try {
    console.log(`Fetching products for artist ID: ${artistId}`);
    const productsCollection = collection(db, "products");
    
    // Use a simpler query without the orderBy to avoid issues with missing fields
    const q = query(
      productsCollection,
      where("artistId", "==", artistId)
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} products for artist`);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Processing product ${doc.id}:`, data);
      
      return {
        id: doc.id,
        artistId: data.artistId,
        title: data.title || { en: "", ar: "" },
        description: data.description || { en: "", ar: "" },
        price: data.price || 0,
        currency: data.currency || "JOD",
        images: data.images || [],
        category: data.category || "painting",
        medium: data.medium || "other",
        dimensions: data.dimensions || { width: 0, height: 0, unit: "cm" },
        weight: data.weight,
        inStock: data.inStock ?? true,
        quantity: data.quantity ?? 1,
        featured: data.featured ?? false,
        dateCreated: data.dateCreated || new Date().toISOString(),
        dateAdded: data.dateAdded || new Date().toISOString(),
        tags: data.tags || []
      };
    });
  } catch (error) {
    console.error("Error getting products by artist:", error);
    return []; // Return empty array instead of throwing error
  }
};

// Search products
export const searchProducts = async (
  query: string,
  filters: {
    categories?: ProductCategory[],
    mediums?: ProductMedium[],
    priceRange?: { min: number, max: number },
    tags?: string[]
  } = {}
): Promise<Product[]> => {
  try {
    // For proper search functionality, you would typically use Algolia or Firebase Extensions
    // This is a simplified version that gets all products and filters them client-side
    const products = await getAllProducts();
    
    return products.filter(product => {
      // Search query filter
      const matchesQuery = !query || 
        product.title.en.toLowerCase().includes(query.toLowerCase()) ||
        product.title.ar.toLowerCase().includes(query.toLowerCase()) ||
        product.description.en.toLowerCase().includes(query.toLowerCase()) ||
        product.description.ar.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      // Category filter
      const matchesCategory = !filters.categories?.length || 
        filters.categories.includes(product.category);
      
      // Medium filter
      const matchesMedium = !filters.mediums?.length || 
        filters.mediums.includes(product.medium);
      
      // Price range filter
      const matchesPriceRange = !filters.priceRange ||
        (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max);
      
      // Tags filter
      const matchesTags = !filters.tags?.length ||
        filters.tags.some(tag => product.tags.includes(tag));
      
      return matchesQuery && matchesCategory && matchesMedium && matchesPriceRange && matchesTags;
    });
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Create or update product
export const saveProduct = async (
  productId: string | undefined,
  productData: Omit<Product, "id" | "images" | "dateAdded">,
  imageUrls: string[] = []
): Promise<Product> => {
  try {
    console.log("Saving product with data:", productData);
    const now = new Date().toISOString();
    // If no productId is provided, create a new one
    const finalProductId = productId || doc(collection(db, "products")).id;
    
    // Prepare product data with images and ensure all required fields exist
    const productToSave = {
      ...productData,
      images: imageUrls,
      dateAdded: now,
      dateCreated: productData.dateCreated ?? now,
      currency: productData.currency ?? "JOD",
      inStock: productData.inStock ?? true,
      quantity: productData.quantity ?? 1,
      featured: productData.featured ?? false,
      tags: productData.tags ?? []
    };
    
    console.log(`Saving product with ID: ${finalProductId}`);
    
    // Save to Firestore
    await setDoc(doc(db, "products", finalProductId), productToSave, { merge: true });
    
    // Return the complete product with ID
    return {
      id: finalProductId,
      ...productToSave
    } as Product;
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    // Delete product document
    await deleteDoc(doc(db, "products", id));
    
    // Delete associated images
    try {
      const imagesRef = ref(storage, `products/${id}/images`);
      // Note: This is a simplified approach. In a real app, you would list all files in the folder and delete them individually
      await deleteObject(imagesRef);
    } catch (error) {
      console.error("Error deleting product images:", error);
      // Continue even if image deletion fails
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
