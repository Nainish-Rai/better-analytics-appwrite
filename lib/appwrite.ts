import { Client, Account, Databases } from "appwrite";

const client = new Client();
client.setProject("67422f01002ea90bd633");

export const account = new Account(client);
export { client };

export const databases = new Databases(client);

// Constants for database and collection IDs
export const WEBSITE_DATABASE_ID = "676713c3003e6713708b"; // or your chosen database name
export const WEBSITE_COLLECTION_ID = "websites";
export const EVENTS_COLLECTION_ID = "67671a4e000c35062b4e"; // Add your actual collection ID here
