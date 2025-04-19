# Firebase Database Structure

This document outlines the structure of the Firebase Firestore collections used in the Law7a application.

## Collections

### 1. Users Collection
- **Document ID**: User's UID (e.g., `ounKK3aLPyYSqF6AyyWbpzMnD893`)
- **Fields**:
  - `createdAt`: Timestamp (e.g., "2025-04-18T20:50:47.294Z")
  - `email`: String (e.g., "abdullaalsabti@yahoo.com")
  - `id`: String - User's UID (e.g., "ounKK3aLPyYSqF6AyyWbpzMnD893")
  - `isArtist`: Boolean (true/false)
  - `name`: String (e.g., "Abdulla")
  - `profilePicture`: String (URL to profile image) - May be empty

### 2. Artists Collection
- **Document ID**: Artist's ID (e.g., `U4IcufYAHUnAhI61FAUw`)
- **Fields**:
  - `bio`: Object with language keys
    - `ar`: String (Arabic biography)
    - `en`: String (English biography)
  - `coverImage`: String (URL to cover image) - May be empty
  - `featured`: Boolean (true/false)
  - `location`: Object with language keys
    - `ar`: String (Arabic location)
    - `en`: String (English location)
  - `name`: Object with language keys
    - `ar`: String (e.g., "Abdulla")
    - `en`: String (e.g., "Abdulla")
  - `profilePicture`: String (URL to profile image) - May be empty
  - `socialLinks`: Object - Contains social media links
  - `tags`: Array of Strings - Artist tags/categories
  - `userId`: String - Reference to user document (e.g., "ounKK3aLPyYSqF6AyyWbpzMnD893")

### 3. Products Collection
- **Document ID**: Product ID (e.g., `b8LTZVNDsKE83KG4V5ij`)
- **Fields**:
  - `artistId`: String - Reference to artist document (e.g., "U4IcufYAHUnAhI61FAUw")
  - `category`: String (e.g., "painting")
  - `currency`: String (e.g., "JOD")
  - `dateAdded`: Timestamp (e.g., "2025-04-18T21:34:57.609Z")
  - `dateCreated`: Timestamp (e.g., "2025-04-18T21:34:57.609Z")
  - `description`: Object with language keys
    - `ar`: String (Arabic description)
    - `en`: String (English description)
  - `dimensions`: Object
    - `depth`: Number (e.g., 100)
    - `height`: Number (e.g., 200)
    - `unit`: String (e.g., "cm")
    - `width`: Number (e.g., 190)
  - `featured`: Boolean (true/false)
  - `images`: Array of Strings - URLs to product images
  - `inStock`: Boolean (true/false)
  - `medium`: String (e.g., "pencil")
  - `price`: Number (e.g., 2000)
  - `quantity`: Number (e.g., 2)
  - `tags`: Array of Strings (e.g., ["painting"])
  - `title`: Object with language keys
    - `ar`: String (Arabic title)
    - `en`: String (English title)

## Relationships

1. **User to Artist**: One-to-one relationship. An artist document references its user through the `userId` field.
2. **Artist to Products**: One-to-many relationship. Products reference their artist through the `artistId` field.

## Notes

- Multi-language support is implemented using objects with language codes as keys (e.g., `ar` for Arabic, `en` for English).
- Images are stored in Firebase Storage, and their URLs are stored in the respective documents.
- The `featured` field is used to highlight specific artists or products on the platform.
