import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { findDublicateShortLink, findShortLinkbyId, getAllShortenLinks, insertShortLink, updateShortCode } from '../services/shortner.services.js';
import { getShortLinkByShortCode } from '../services/shortner.services.js';
import { shortUserSchema } from '../validators/shortner-validators.js';
import z from 'zod';
import { db } from '../config/db.js';

export const getShortnerPage = async (req, res) => {
  try {

    if (!req.user) return res.redirect("/login")
    const links = await getAllShortenLinks(req.user.id);

    let isLoggedIn = req.cookies.isLoggedIn; // default false if not set

    return res.render("index", {
      links, // send to index file 
      host: req.headers.host,
      errors: req.flash("errors"),
      isLoggedIn,
      title: "URL Shortener" // pass title here
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
}

export const postURLShortner = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login")
    const { url, shortcode } = req.body;
    const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

    const links = await getShortLinkByShortCode(finalShortCode);


    if (links) {
      // return res.status(400).send("Short code already exists. Use another");
      req.flash("errors", "Short code already exists. Please use another one.");
      return res.redirect('/');
    }

    // Validate user input using schema
    const result = shortUserSchema.safeParse({ url, shortcode: finalShortCode });
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message);
      req.flash("errors", errorMessages);
      return res.redirect('/');
    }
    // await saveLinks(links);
    await insertShortLink({ url, finalShortCode, userId: req.user.id })
    // await saveLinks({ url, shortcode })
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
}

export const redirectToShortLinks = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const links = await getShortLinkByShortCode(shortcode);
    // const links = await loadLinks();

    if (!links) {
      return res.status(404).send("404 error occurred");
    }

    return res.redirect(links.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}

export const getShortnerEditPage = async (req, res) => {
  if (!req.user) return res.redirect("/login")
  // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

  try {
    const shortlink = await findShortLinkbyId(id);
    if (!shortlink) return res.redirect("404")

    res.render("edit-shortlink", {
      id: shortlink.id,
      url: shortlink.url,
      shortcode: shortlink.shortCode,
      errors: req.flash("errors"),
      title: "Edit Shortlink",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
}

export const postShortnerEditPage = async (req, res) => {
  if (!req.user) return res.redirect("/login")
  // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

  try {
    const { url, shortcode } = req.body;

    // 🛑 Check if another link already uses the same shortcode
    const existing = await findDublicateShortLink({ shortcode })

    if (existing) {
      req.flash("errors", "Shortcut already exists, please choose another");
      return res.redirect(`/edit/${id}`);
    }

    const newUpdateShortCode = await updateShortCode({ id, url, shortcode });
    if (!newUpdateShortCode) return res.redirect("404");

    return res.redirect("/");
  } catch (error) {
    console.error("Caught error:", error);
    return res.status(500).send("Internal server error");
  }
}