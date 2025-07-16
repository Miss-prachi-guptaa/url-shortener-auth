// import { readFile, writeFile } from 'fs/promises';
// import path from 'path';

// const DATA_FILE = path.join('data', 'links.json');

// export const saveLinks = async (links) => {
//   await writeFile(DATA_FILE, JSON.stringify(links, null, 2));
// };

// export const loadLinks = async () => {
//   try {
//     const data = await readFile(DATA_FILE, 'utf-8');
//     return JSON.parse(data);
//   } catch (error) {
//     if (error.code === "ENOENT") {
//       await writeFile(DATA_FILE, JSON.stringify({}));
//       return {};
//     }
//     throw error;
//   }
// };

import { dbClient } from '../config/db-client.js';
import { env } from '../config/env.js'

await dbClient.connect();
console.log("Connected to MongoDB in model");
const db = dbClient.db(env.MONGODB_DATABASE_NAME);
const shortnerCollection = db.collection('shortners');

export const loadLinks = async () => {
  return shortnerCollection.find().toArray();
}

export const saveLinks = async (link) => {
  return shortnerCollection.insertOne(link);
}

export const getLinkByShotCode = async (shortcode) => {
  return await shortnerCollection.findOne({ shortcode: shortcode })
}