import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockArtists, mockProducts } from './mockData';

/**
 * Uploads all mock artists to Firestore
 */
export const uploadMockArtists = async () => {
  try {
    console.log('Starting to upload mock artists...');
    const artistsCollection = collection(db, 'artists');
    
    // Check if artists already exist
    const existingArtistsSnapshot = await getDocs(artistsCollection);
    if (!existingArtistsSnapshot.empty) {
      console.log(`Found ${existingArtistsSnapshot.size} existing artists. Skipping upload.`);
      return;
    }
    
    // Upload each artist
    for (const artist of mockArtists) {
      await setDoc(doc(artistsCollection, artist.id), {
        userId: artist.userId,
        name: artist.name,
        bio: artist.bio,
        profilePicture: artist.profilePicture,
        coverImage: artist.coverImage,
        location: artist.location,
        socialLinks: artist.socialLinks || {},
        tags: artist.tags || [],
        featured: artist.featured || false
      });
      console.log(`Uploaded artist: ${artist.name.en}`);
    }
    
    console.log('Successfully uploaded all mock artists!');
  } catch (error) {
    console.error('Error uploading mock artists:', error);
    throw error;
  }
};

/**
 * Uploads all mock products to Firestore
 */
export const uploadMockProducts = async () => {
  try {
    console.log('Starting to upload mock products...');
    const productsCollection = collection(db, 'products');
    
    // Check if products already exist
    const existingProductsSnapshot = await getDocs(productsCollection);
    if (!existingProductsSnapshot.empty) {
      console.log(`Found ${existingProductsSnapshot.size} existing products. Skipping upload.`);
      return;
    }
    
    // Upload each product
    for (const product of mockProducts) {
      await setDoc(doc(productsCollection, product.id), {
        artistId: product.artistId,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        medium: product.medium,
        dimensions: product.dimensions,
        inStock: product.inStock,
        quantity: product.quantity || 1,
        featured: product.featured || false,
        tags: product.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Uploaded product: ${product.title.en}`);
    }
    
    console.log('Successfully uploaded all mock products!');
  } catch (error) {
    console.error('Error uploading mock products:', error);
    throw error;
  }
};

/**
 * Uploads all mock data (artists and products) to Firestore
 */
export const uploadAllMockData = async () => {
  try {
    await uploadMockArtists();
    await uploadMockProducts();
    console.log('Successfully uploaded all mock data!');
    return true;
  } catch (error) {
    console.error('Error uploading mock data:', error);
    return false;
  }
};

/**
 * Clears all mock data from Firestore
 */
export const clearMockData = async () => {
  try {
    console.log('Starting to clear mock data...');
    
    // Clear artists
    const artistsCollection = collection(db, 'artists');
    const artistsSnapshot = await getDocs(artistsCollection);
    for (const artistDoc of artistsSnapshot.docs) {
      await deleteDoc(doc(db, 'artists', artistDoc.id));
    }
    
    // Clear products
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    for (const productDoc of productsSnapshot.docs) {
      await deleteDoc(doc(db, 'products', productDoc.id));
    }
    
    console.log('Successfully cleared all mock data!');
    return true;
  } catch (error) {
    console.error('Error clearing mock data:', error);
    return false;
  }
};
