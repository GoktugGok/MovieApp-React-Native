import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SaveButton from '@/components/SaveButton';
import { addToFavorites, isMovieFavorited, removeFromFavorites } from '@/services/appwrite';
import { Account } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value}: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>
      {label}
    </Text>
    <Text className='text-light-100 font-bold text-sm mt-2'>
      {value || 'N/A'}
    </Text>
  </View>
)

const account = new Account(client);

const MovieDetails = () => {
const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  // Favori durumu için state
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteDocId, setFavoriteDocId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Sayfa açıldığında user ve favori durumunu çek
  useEffect(() => {
  const fetchUserAndFavorite = async () => {
    if (!movie?.id) return;

    try {
      const user = await account.get();  
      setUserId(user.$id);

      const favDoc = await isMovieFavorited(user.$id, movie.id);
      if (favDoc) {
        setIsFavorite(true);
        setFavoriteDocId(favDoc.$id);
      } else {
        setIsFavorite(false);
        setFavoriteDocId(null);
      }
    } catch (err) {
      console.log("User/favorite fetch error:", err);
    }
  };

  fetchUserAndFavorite();
}, [movie?.id]);


  // Butona tıklanınca favori ekle/kaldır
  const handleToggleFavorite = async (newValue: boolean) => {
    if(!userId){
      router.push('/auth/login');
      return;
    }
    if (!movie) return;

    try {
      if (newValue) {
        // Favori ekle
        const doc = await addToFavorites(userId, movie);
        setFavoriteDocId(doc.$id);
        setIsFavorite(true);
      } else if (favoriteDocId) {
        // Favori kaldır
        await removeFromFavorites(favoriteDocId);
        setFavoriteDocId(null);
        setIsFavorite(false);
      }
    } catch (error) {
      console.log("Favori toggle error:", error);
    }
  };

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: 80}}>
          <View>
              <Image source={{ uri:`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className='w-full h-[550px]' resizeMode='stretch' />
          </View>
          <View className='flex-col items-start justify-center mt-5 px-5'>
            <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
            <View className='flex-row items-center gap-x-1 mt-2'>
              <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
              <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
            </View>
            <View className='flex-row items-center bg-dark-100 px-2 pyy-1 rounded-md gap-x-1 mt-2'>
              <Image source={icons.star} className='size-4'/>
              <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
              <Text className='text-light-200 text-sm'>({movie?.vote_count} votes)</Text>
            </View>
            <MovieInfo label='Overview' value={movie?.overview}/>
            <MovieInfo label='Genres' value={movie?.genres?.map((g)=> g.name).join(' - ') || 'N/A'}/>
            <View className='flex flex-row justify-between w-1/2'>
              <MovieInfo label='Budget' value={`$${movie?.budget / 1_000_000} million`}/>
              <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue) / 1_000_000}`} />
            </View>
            <MovieInfo label='Production Companies' value={movie?.production_companies.map((c)=> c.name).join(' - ') || 'N/A'}/>
          </View>
      </ScrollView>
      <TouchableOpacity className='absolute top-6 right-6 p-3  rounded-2xl shadow-lg'>
        <SaveButton saved={isFavorite} onToggle={handleToggleFavorite} />
      </TouchableOpacity>
      <TouchableOpacity className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50' onPress={router.back}>
        <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#fff"/>
        <Text className='text-white font-semibold text-base'>Go back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails