import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Router } from 'express';

const router = Router();

const DATA_FILE = path.join('data', 'links.json');

const saveLinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links, null, 2));
};

const loadLinks = async () => {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};


router.get("/report", (req, res) => {
  const student = [
    {
      name: "Aarav",
      grade: "10th",
      favoriteSubject: "Mathematics",
    },
    {
      name: "Ishita", grade: "9th", favoriteSubject: "Science"
    },
    {
      name: "Rohan", grade: "8th", favoriteSubject: "History"
    },
    {
      name: "Meera", grade: "10th", favoriteSubject: "English"
    },
    {
      name: "Kabir", grade: "11th", favoriteSubject: "Physics"
    },
  ];
  return res.render("report", { student }); // ensure you have views/report.ejs
});


// Home route to display index.html with links inserted
router.get('/', async (req, res) => {
  try {
    const file = await readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll(
      "{{shortened_urls}}",
      Object.entries(links)
        .map(
          ([shortCode, url]) =>
            `<li><a href="/${shortCode}" target="_blank">${req.headers.host}/${shortCode}</a> - ${url}</li>`
        ).join("")
    );

    return res.send(content);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

// POST route to add URL and shortcode
router.post('/', async (req, res) => {
  try {
    const { url, shortcode } = req.body;
    const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

    const links = await loadLinks();

    if (links[finalShortCode]) {
      return res.status(400).send("Short code already exists. Use another");
    }

    links[finalShortCode] = url;
    await saveLinks(links);
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

//  Route to redirect based on shortCode
router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();

    if (!links[shortCode]) {
      return res.status(404).send("404 error occurred");
    }

    return res.redirect(links[shortCode]);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// export default router;

// Named export;
export const shortenRoutes = router;

