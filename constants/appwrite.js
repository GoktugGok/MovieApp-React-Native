import { Client, Account, Databases } from 'appwrite'

const client = new Client()

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite cloud endpoint
  .setProject('SENİN_PROJECT_ID') // kendi Project ID'ni yaz

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases }