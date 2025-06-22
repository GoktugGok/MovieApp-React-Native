import { Databases, ID, Permission, Query, Role } from "react-native-appwrite";
import { client } from "../lib/appwrite"; // @ alias varsa, yoksa ../lib/appwrite

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const database = new Databases(client);

// Buradan sonra işlemleri dışa aktarabilirsin


export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', query)
    ])

    if(result.documents.length > 0){
        const existingMovie = result.documents[0];

        await database.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existingMovie.$id,
            {
                count: existingMovie.count + 1
            }
        )
    } else {
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            count: 1,
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })
    }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc('count'),  
        ])
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error)
        return undefined;
    }
}

export const addToFavorites = async (userId: string, movie: Movie) => {
  try {
    // Aynı favori zaten var mı diye kontrol
    const existing = await isMovieFavorited(userId, movie.id);
    if (existing) {
      return existing; // Zaten varsa yeni oluşturma
    }

    const result = await database.createDocument(DATABASE_ID, 'favorites', ID.unique(), {
      user_id: userId,
      movie_id: movie.id,
      title: movie.title,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    });

    return result;
  } catch (error) {
    console.log('Favori ekleme hatası:', error);
    throw error;
  }
};



export const removeFromFavorites = async (documentId: string) => {
    try {
      await database.deleteDocument(DATABASE_ID, 'favorites', documentId);  
    } catch (error) {
        console.log('Favori silme hatası:', error);
        throw error;
    }
}

export const getUserFavorites = async (userId: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, 'favorites', [
      Query.equal('user_id', userId)
    ]);
    return result.documents;
  } catch (error) {
    console.log('Favori çekme hatası:', error);
    return [];
  }
}

export const isMovieFavorited = async (userId: string, movieId: number) =>{
    try {
        const result = await database.listDocuments(DATABASE_ID, 'favorites', [
            Query.equal('user_id', userId),
            Query.equal('movie_id', movieId)
        ])
        return result.documents.length > 0 ? result.documents[0] : null;
    } catch (error) {
        console.log('Favori kontrol hatası:', error);
        return null;
    }
}