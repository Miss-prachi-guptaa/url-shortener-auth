import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { getAllShortenLinks, insertShortLink } from '../services/shortner.services.js';
import { getShortLinkByShortCode } from '../services/shortner.services.js';

export const getShortnerPage = async (req, res) => {
  try {
    const links = await getAllShortenLinks();

    let isLoggedIn = req.cookies.isLoggedIn; // default false if not set

    return res.render("index", {
      links, // send to index file 
      host: req.headers.host,
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
    const { url, shortcode } = req.body;
    const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

    const links = await getShortLinkByShortCode(finalShortCode);


    if (links) {
      return res.status(400).send("Short code already exists. Use another");
    }

    // links[finalShortCode] = url;

    // await saveLinks(links);
    await insertShortLink({ url, finalShortCode })
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