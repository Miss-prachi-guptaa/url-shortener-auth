import express from 'express';
import { shortenRoutes } from './routes/shortnerRouter.js';

import { authRoute } from './routes/auth.router.js';
import cookieParser from 'cookie-parser';


const app = express();



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // middleware 

app.set("view engine", "ejs");

app.use(cookieParser())
app.use(authRoute);
app.use(shortenRoutes); // middleware to use router

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

