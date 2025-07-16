import express from 'express';
import { shortenRoutes } from './routes/shortnerRouter.js';
import { env } from './config/env.js';


const app = express();



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // middleware 

app.set("view engine", "ejs");


app.use(shortenRoutes); // middleware to use router
app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}`);
});

