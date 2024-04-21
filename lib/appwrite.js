import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsbr.recipea",
  projectId: "661bb36764e5d0fbcc19",
  databaseId: "661bb4760ca8933a2534",
  userCollectionId: "661bb48cef12d74d9970",
  recipeCollectionId: "661bb4b631a822bbf89b",
  favoriteCollectionId: "6623e6e75b7d593709b6",
  storageId: "661bb5fcd6ee9b7f8831",
};
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  recipeCollectionId,
  favoriteCollectionId,
  storageId,
} = appwriteConfig;

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  console.log("FILE", file)

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };
  console.log("asset", asset)

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    console.log(fileUrl)
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createPost(form) {
  try {
    const [thumbnailUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      recipeCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        description: form.description,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, recipeCollectionId);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(databaseId, recipeCollectionId, [
      Query.equal("creator", userId),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(databaseId, recipeCollectionId, [
      Query.search("title", query),
    ]);

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, recipeCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function isFavorite({ userId, postId }) {
  try {
    const response = await databases.listDocuments(
      databaseId,
      favoriteCollectionId,
      [Query.equal("users", userId), Query.equal("recipes", postId)]
    );
    return response.documents.length > 0 ? response.documents[0].$id : false;
  } catch (error) {
    console.error("Failed to check favorite status:", error);
    return false;
  }
}

export async function removeFromFavorite(documentId) {
  try {
    await databases.deleteDocument(
      databaseId,
      favoriteCollectionId,
      documentId
    );
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    throw new Error(error);
  }
}
export async function toggleFavorite({ userId, postId, favId }) {
  if (!!favId) {
    await removeFromFavorite(favId);
    return false; // Zwraca false, oznaczając, że usunięto z ulubionych
  } else {
    try {
      await databases.createDocument(
        databaseId,
        favoriteCollectionId,
        ID.unique(),
        { users: userId, recipes: postId }
      );
      return true; // Zwraca true, oznaczając, że dodano do ulubionych
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw new Error(error);
    }
  }
}

export async function getFavorites(userId) {
  try {
    // Pobieranie ulubionych dokumentów użytkownika
    const favoritesResponse = await databases.listDocuments(
      databaseId,
      favoriteCollectionId,
      [Query.equal("users", userId)]
    );

    if (favoritesResponse.documents.length === 0) {
      console.log("No favorites found for the user.");
      return [];
    }

    // Pobieranie ID wideo z ulubionych
    const recipeIds = favoritesResponse.documents.map((doc) => doc.recipes); 

    // Pobieranie szczegółów dla każdego ID przepisu
    const recipeDetailsPromises = recipeIds.map((id) =>
      databases.getDocument(databaseId, recipeCollectionId, id.$id)
    );
    const recipeDetails = await Promise.all(recipeDetailsPromises);

    // Zwracanie szczegółów wideo
    return recipeDetails;
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return [];
  }
}

export async function getPost(postId) {
  try {
    const post = await databases.getDocument(
      databaseId,
      recipeCollectionId,
      postId
    );
    return post;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePost(postId, form) {
  console.log("Form data before update:", form);

  try {
    console.log("Post ID:", postId);
    console.log("Starting update with form data:", form);

    const updatedPost = await databases.updateDocument(
      databaseId,
      recipeCollectionId,
      postId,
      {
        title: form.title,
        thumbnail: form.thumbnailUrl,
        description: form.description,
      }
    );

    console.log("Updated post:", updatedPost);

    return updatedPost;
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw new Error(error);
  }
}

export async function deletePost(postId) {
  try {
    const deletedPost = await databases.deleteDocument(
      databaseId,
      recipeCollectionId,
      postId
    );

    return deletedPost;
  } catch (error) {
    throw new Error(error);
  }
}
