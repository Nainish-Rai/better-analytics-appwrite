import { Client, Account, Databases } from "appwrite";

const client = new Client();
client.setProject("67422f01002ea90bd633");

export const account = new Account(client);
export { client };

export const databases = new Databases(client);

// Constants for database and collection IDs
export const WEBSITE_DATABASE_ID = "your_database_id";
export const WEBSITE_COLLECTION_ID = "websites";
