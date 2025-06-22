import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Account } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import { getUserFavorites } from '@/services/appwrite';
import MovieCard from '@/components/MovieCard';
import { useFocusEffect } from '@react-navigation/native';

const account = new Account(client);

const Saved = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const user = await account.get();
          setUserId(user.$id);

          const favData = await getUserFavorites(user.$id);
          const mappedMovies = favData.map((fav: any) => ({
            id: fav.movie_id,
            title: fav.title,
            poster_path: fav.poster_url.replace('https://image.tmdb.org/t/p/w500', ''),
            vote_average: 10,
            release_date: '2023-01-01'
          }));

          setFavorites(mappedMovies);
        } catch (error) {
          console.log('Favori çekilemedi:', error);
        }
      };

      fetchFavorites();
    }, [])
  );

  return (
    <View className="flex-1 bg-primary px-4 pt-6">

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
          marginBottom: 20,
          marginTop: 30,
        }}
        ListHeaderComponent={
          <Text className="text-white font-bold text-xl mb-4 mt-16">
            💜 Your Favorite Movies
          </Text>
        }
        ListEmptyComponent={
          <Text className="text-light-300 text-center mt-10">
            You haven't saved any movies yet... 🤔
          </Text>
        }
        contentContainerStyle={{
          paddingBottom: 80,
          paddingTop: 10,
          paddingHorizontal: 4,
        }}
      />

    </View>
  );
};

export default Saved;
