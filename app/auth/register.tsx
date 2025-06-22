import KeyboardDismissWrapper from "@/components/KeyboardDismissWrapper";
import { client } from "@/lib/appwrite";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Account, ID } from "react-native-appwrite";

const account = new Account(client)

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleRegister = async () => {
    try {
     await account.create(ID.unique(), email, password, name) 
     await account.createEmailPasswordSession(email, password)
     router.replace('/')
    } catch (err: any) {
      console.log('Register error:', JSON.stringify(err, null, 2))
    }
  }
  return (
    <KeyboardDismissWrapper>
      <View className="flex-1 justify-center items-center bg-primary px-5">
        <Text className="text-white text-2xl font-bold mb-5">Register</Text>

        <TextInput 
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          onChangeText={setName}
          value={name}
          className="bg-dark-100 w-full p-3 rounded-lg text-white mb-3"
        />
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
        <TouchableOpacity onPress={handleRegister} className="bg-accent px-6 py-3 rounded-lg w-full">
          <Text className="text-white font-bold text-center text-base">Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardDismissWrapper>
  )
}

export default Register