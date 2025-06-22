import { View, Text, Alert, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Account } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import KeyboardDismissWrapper from '@/components/KeyboardDismissWrapper';

const account = new Account(client);

export default function EditProfile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const updateName = async () => {
        try {
            await account.updateName(name)
            Alert.alert('Success', 'Name updated!');
        } catch (error) {
            console.log('Update name error:', error);
            Alert.alert('Error', 'Failed to update name.');
        }
    }

    const updateEmail = async () =>{
        try {
            await account.updateEmail(email, currentPassword)
            Alert.alert('Success', 'Email updated!');
        } catch (error) {
            console.log('Update email error:', error);
            Alert.alert('Error', 'Check your password or try again.');
        }
    }

    const updatePassword = async () => {
        try {
           await account.updatePassword(newPassword, password)
           Alert.alert('Success', 'Password updated!');
        } catch (error) {
            console.log('Update password error:', error);
            Alert.alert('Error', 'Check your current password.');
        }
    }
    return (
    <KeyboardDismissWrapper>
    <View className="flex-1 bg-primary px-6 gap-6">

      {/* Name */}
      <TextInput
        placeholder="New Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        className="bg-dark-100 text-white mt-16 p-4 rounded-md"
      />
      <TouchableOpacity className="bg-accent p-4 rounded-md" onPress={updateName}>
        <Text className="text-center text-white font-bold">Update Name</Text>
      </TouchableOpacity>

      {/* Email */}
      <TextInput
        placeholder="New Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        className="bg-dark-100 text-white p-4 rounded-md"
      />
      <TextInput
        placeholder="Current Password"
        placeholderTextColor="#aaa"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        className="bg-dark-100 text-white p-4 rounded-md"
      />
      <TouchableOpacity className="bg-accent p-4 rounded-md" onPress={updateEmail}>
        <Text className="text-center text-white font-bold">Update Email</Text>
      </TouchableOpacity>

      {/* Password */}
      <TextInput
        placeholder="Current Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-dark-100 text-white p-4 rounded-md"
      />
      <TextInput
        placeholder="New Password"
        placeholderTextColor="#aaa"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        className="bg-dark-100 text-white p-4 rounded-md"
      />
      <TouchableOpacity className="bg-accent p-4 rounded-md" onPress={updatePassword}>
        <Text className="text-center text-white font-bold">Update Password</Text>
      </TouchableOpacity>
    </View>
    </KeyboardDismissWrapper>
  );
  
}
