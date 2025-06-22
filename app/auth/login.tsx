import { client } from "@/lib/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Account } from "react-native-appwrite";

const account = new Account(client)

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () =>{
    try {
      await account.createEmailPasswordSession(email, password)
      router.replace('/')
    } catch (err) {
      console.log('Login Error:', err)
    }
  }
  return (
    <View className="flex-1 justify-center items-center bg-primary px-5">
      <Text className="text-white text-2xl font-bold mb-5">Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        value={email}
        className="bg-dark-100 w-full p-3 rounded-lg text-white mb-3"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        onChangeText={setPassword}
        value={password}
        className="bg-dark-100 w-full p-3 rounded-lg text-white mb-3"
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-accent px-6 py-3 rounded-lg mt-2 w-full"
      >
        <Text className="text-white font-bold text-base text-center">Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login