import { ID, Account } from "react-native-appwrite";
import { client } from "../lib/appwrite"; 

const account = new Account(client);

export const register = async (email: string, password: string, name: string) => {
    return await account.create(ID.unique(),email,password, name);
}

export const login = async (email: string, password: string) => {
  return await account.createEmailPasswordSession(email, password);
};

export const logout = async () => {
    return await account.deleteSession('current');
}

export const getCurrentUser = async () => {
    return await account.get(); 
}