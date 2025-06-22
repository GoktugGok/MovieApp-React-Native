import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants/icons'
import { Account } from 'react-native-appwrite'
import { client } from '@/lib/appwrite'
import { router } from 'expo-router'
import Icon from 'react-native-vector-icons/Feather';

const account = new Account(client)

const Profile = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await account.get()
        setUser(userData)
      } catch (err) {
        setUser(null)
      }
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
    } catch (err) {
      console.log("Logout error:", err)
    }
  }

  const goEditProfile = () => router.push('/auth/edit')
  const goLogin = () => router.push('/auth/login')
  const goRegister = () => router.push('/auth/register')

  return (
    <View className="bg-primary flex-1 px-10">
        {!user && (
          <View className="flex justify-center items-center flex-1 flex-col gap-5">
            <Image source={icons.person} className="size-10 mb-4" tintColor="#fff" />

            <TouchableOpacity
              onPress={goLogin}
              className="bg-accent px-6 py-3 rounded-lg mt-2 w-full"
            >
              <Text className="text-white font-bold text-base text-center">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goRegister}
              className="bg-dark-100 px-6 py-3 rounded-lg w-full"
            >
              <Text className="text-white font-bold text-base text-center">Register</Text>
            </TouchableOpacity>
          </View>
        )}

        {user && (  
          <View className="flex justify-center items-center mt-5 flex-1 flex-col gap-5">
          <TouchableOpacity
            className="absolute top-10 right-5 z-10"
            onPress={goEditProfile}
          >
            <Icon name="settings" size={24} color="#fff" />
          </TouchableOpacity>
            <Image source={icons.person} className="size-10 mb-4" tintColor="#fff" />
            <Text className="text-white text-lg font-bold">Welcome, {user.name}</Text>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-600 px-6 py-3 rounded-lg mt-4 w-full"
            >
              <Text className="text-white font-bold text-base text-center">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  )
}

export default Profile
