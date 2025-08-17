import { db } from '../config/db.js'
import { shortLinkTable } from '../drizzle/schema.js'
import { eq } from 'drizzle-orm'
import { and, not } from "drizzle-orm";



export const getAllShortenLinks = async (userId) => {
  return await db.select().from(shortLinkTable).where(eq(shortLinkTable.userId, userId));
}

export const getShortLinkByShortCode = async (shortcode) => {
  const [result] = await db
    .select()
    .from(shortLinkTable)
    .where(eq(shortLinkTable.shortCode, shortcode));
  return result;
};

export const insertShortLink = async ({ url, finalShortCode, userId }) => {
  await db.insert(shortLinkTable).values({
    url: url,
    shortCode: finalShortCode,
    userId,
  });
};

export const findShortLinkbyId = async (id) => {
  const [result] = await db
    .select()
    .from(shortLinkTable)
    .where(eq(shortLinkTable.id, id));
  return result;  // we get whole line of that id 
};

// updateShortCode
export const updateShortCode = async ({ id, url, shortcode }) => {
  console.log("Updating:", { id, url, shortcode });

  const query = db
    .update(shortLinkTable)
    .set({
      url: url,
      shortCode: shortcode, // use DB column name directly as key
    })
    .where(eq(shortLinkTable.id, id));


  return await query;
};

export const findDublicateShortLink = async ({ shortcode }) => {
  console.log("Checking for duplicate shortcode:", shortcode);

  const [existing] = await db
    .select()
    .from(shortLinkTable)
    .where(eq(shortLinkTable.shortCode, shortcode));

  return existing; // returns undefined if no duplicate
};