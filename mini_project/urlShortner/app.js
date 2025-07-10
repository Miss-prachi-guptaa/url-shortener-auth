import { readFile, writeFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';
import crypto from 'crypto';

const PORT = 3002;
const DATA_FILE = path.join('data', 'links.json');

const serveFile = async (res, filePath, contentType) => {
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");
  }
};

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

const server = createServer(async (req, res) => {

  if (req.method === 'GET') {
    if (req.url === '/') {
      return serveFile(res, path.join("public", "index.html"), "text/html");
    } else if (req.url === "/style.css") {
      return serveFile(res, path.join("public", "style.css"), "text/css");
    } else if (req.url === "/links") {
      const links = await loadLinks();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(links));
    } else {
      const links = await loadLinks();
      const shortcode = req.url.slice(1);
      if (links[shortcode]) {
        res.writeHead(302, { location: links[shortcode] });
        return res.end();
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Shortened URL not found");
      }
    }
  }

  if (req.method === 'POST' && req.url === "/shorten") {
    const links = await loadLinks();
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { url, shortcode } = JSON.parse(body);
        console.log("POST received:", url, shortcode);

        if (!url) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("URL is required");
        }
        // check shortcode that we get is not a dubpilcate data
        const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");


        // if it is duplicate then return message of error;
        if (links[finalShortCode]) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          alert("Short code already exists. Use another")
          return res.end("Short code already exists. Use another.");
        }
        // if not duplicate add it to url first tjjen send to file;
        // Added key : value; {shorcode: url}
        links[finalShortCode] = url;

        // and then we call savedlinks () to add this particular data;
        await saveLinks(links);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, shortcode: finalShortCode }));
      } catch (error) {
        console.error("Error handling POST /shorten:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
