// it is the main file for Form folder .change dev: from.js in package.json 
//  "dev": "node  --env-file=.env --watch form.js"

import express from 'express';
import { PORT } from './env.js';
import path from 'path';



const app = express();

const staticPath = path.join(import.meta.dirname, "Form");
app.use(express.static(staticPath));

app.get("/contact", (req, res) => {
  console.log(req.query);
  res.redirect("/");
})

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`)
})