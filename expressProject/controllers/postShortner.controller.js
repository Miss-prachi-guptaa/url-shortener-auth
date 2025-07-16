import crypto from 'crypto';
import { saveLinks, loadLinks, getLinkByShotCode } from '../models/shortner.model.js';
import { readFile } from 'fs/promises';
import path from 'path';

export const getShortnerPagen = async (req, res) => {
  try {
    const file = await readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll(
      "{{shortened_urls}}",
      links.map(
        ({ shortcode, url }) =>
          `<li><a href="/${shortcode}" target="_blank">${req.headers.host}/${shortcode}</a> - ${url}</li>`
      ).join("")
    );

    return res.send(content);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
}

export const postURLShortner = async (req, res) => {
  try {
    const { url, shortcode } = req.body;
    const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

    const links = await loadLinks();

    if (links[finalShortCode]) {
      return res.status(400).send("Short code already exists. Use another");
    }

    // links[finalShortCode] = url;

    // await saveLinks(links);
    await saveLinks({ url, shortcode })
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
}

export const redirectToShortLinks = async (req, res) => {
  try {
    const { shortcode } = req.params;
    console.log("shortcode", shortcode)
    // const links = await loadLinks();

    const link = await getLinkByShotCode(shortcode);
    console.log(link)

    if (!link) {
      return res.status(404).send("404 error occurred");
    }

    return res.redirect(link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
}