

// import { dbClient } from '../config/db-client.js';
// import { env } from '../config/env.js'

// await dbClient.connect();
// console.log("Connected to MongoDB in model");
// const db = dbClient.db(env.MONGODB_DATABASE_NAME);
// const shortnerCollection = db.collection('shortners');

// export const loadLinks = async () => {
//   return shortnerCollection.find().toArray();
// }

// export const saveLinks = async (link) => {
//   return shortnerCollection.insertOne(link);
// }

// export const getLinkByShotCode = async (shortcode) => {
//   return await shortnerCollection.findOne({ shortcode: shortcode })
// }