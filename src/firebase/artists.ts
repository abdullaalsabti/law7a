import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import { Artist, TranslatedText } from "../types";

// Get all artists
export const getAllArtists = async (): Promise<Artist[]> => {
  try {
    const artistsCollection = collection(db, "artists");
    const artistsSnapshot = await getDocs(artistsCollection);
    
    return artistsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        bio: data.bio,
        profilePicture: data.profilePicture,
        coverImage: data.coverImage,
        location: data.location,
        socialLinks: data.socialLinks || {},
        tags: data.tags || [],
        featured: data.featured || false
      };
    });
  } catch (error) {
    console.error("Error getting artists:", error);
    throw error;
  }
};

// Get artist by ID
export const getArtistById = async (id: string): Promise<Artist | null> => {
  try {
    const artistDoc = await getDoc(doc(db, "artists", id));
    
    if (artistDoc.exists()) {
      const data = artistDoc.data();
      return {
        id: artistDoc.id,
        userId: data.userId,
        name: data.name,
        bio: data.bio,
        profilePicture: data.profilePicture,
        coverImage: data.coverImage,
        location: data.location,
        socialLinks: data.socialLinks || {},
        tags: data.tags || [],
        featured: data.featured || false
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting artist:", error);
    throw error;
  }
};

// Get artist by user ID
export const getArtistByUserId = async (userId: string): Promise<Artist | null> => {
  try {
    const artistsCollection = collection(db, "artists");
    const q = query(artistsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const artistDoc = querySnapshot.docs[0];
      const data = artistDoc.data();
      return {
        id: artistDoc.id,
        userId: data.userId,
        name: data.name,
        bio: data.bio,
        profilePicture: data.profilePicture,
        coverImage: data.coverImage,
        location: data.location,
        socialLinks: data.socialLinks || {},
        tags: data.tags || [],
        featured: data.featured || false
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting artist by user ID:", error);
    throw error;
  }
};

// Create or update artist profile
export const saveArtistProfile = async (
  artistData: Omit<Artist, "id">,
  profilePictureFile?: File,
  coverImageFile?: File
): Promise<Artist> => {
  try {
    // Check if artist already exists
    const existingArtist = await getArtistByUserId(artistData.userId);
    const artistId = existingArtist?.id || doc(collection(db, "artists")).id;
    
    // Upload profile picture if provided
    let profilePictureUrl = artistData.profilePicture;
    if (profilePictureFile) {
      const profilePictureRef = ref(storage, `artists/${artistId}/profile-picture`);
      await uploadBytes(profilePictureRef, profilePictureFile);
      profilePictureUrl = await getDownloadURL(profilePictureRef);
    }
    
    // Upload cover image if provided
    let coverImageUrl = artistData.coverImage;
    if (coverImageFile) {
      const coverImageRef = ref(storage, `artists/${artistId}/cover-image`);
      await uploadBytes(coverImageRef, coverImageFile);
      coverImageUrl = await getDownloadURL(coverImageRef);
    }
    
    // Prepare artist data
    const artistToSave = {
      ...artistData,
      profilePicture: profilePictureUrl,
      coverImage: coverImageUrl
    };
    
    // Save to Firestore
    await setDoc(doc(db, "artists", artistId), artistToSave, { merge: true });
    
    return {
      id: artistId,
      ...artistToSave
    };
  } catch (error) {
    console.error("Error saving artist profile:", error);
    throw error;
  }
};

// Update artist profile
export const updateArtistProfile = async (
  id: string,
  updates: Partial<Omit<Artist, "id">>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "artists", id), updates);
  } catch (error) {
    console.error("Error updating artist profile:", error);
    throw error;
  }
};

// Create artist profile for a user
export const createArtistProfile = async (
  userId: string,
  name: TranslatedText,
  bio: TranslatedText,
  location: TranslatedText,
  profilePicture?: string,
  tags: string[] = []
): Promise<Artist> => {
  try {
    const artistId = doc(collection(db, "artists")).id;
    
    const artistData: Omit<Artist, "id"> = {
      userId,
      name,
      bio,
      location,
      profilePicture: profilePicture || "",
      coverImage: "",
      socialLinks: {},
      tags,
      featured: false
    };
    
    await setDoc(doc(db, "artists", artistId), artistData);
    
    return {
      id: artistId,
      ...artistData
    };
  } catch (error) {
    console.error("Error creating artist profile:", error);
    throw error;
  }
};
