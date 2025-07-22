import { db } from '../config/db.js'
import { shortLinkTable } from '../drizzle/schema.js'
import { eq } from 'drizzle-orm'


export const getAllShortenLinks = async (req, res) => {
  return await db.select().from(shortLinkTable)
}

export const getShortLinkByShortCode = async (shortcode) => {
  const [result] = await db
    .select()
    .from(shortLinkTable)
    .where(eq(shortLinkTable.shortCode, shortcode));
  return result;
};

export const insertShortLink = async ({ url, finalShortCode }) => {
  await db.insert(shortLinkTable).values({
    url: url,
    shortCode: finalShortCode
  });
};