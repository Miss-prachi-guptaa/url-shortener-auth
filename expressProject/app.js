import express from 'express';
import flash from 'connect-flash'
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip'
import session from 'express-session'

import { verifyAuthentication } from './middlewares/verify-middleware.js'
import { authRoute } from './routes/auth.router.js';
import { shortenRoutes } from './routes/shortnerRouter.js';


const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // middleware 

app.set("view engine", "ejs");



app.use(cookieParser())
app.use(session({ secret: "my-secret", resave: true, saveUninitialized: false }))
app.use(flash());
app.use(requestIp.mw());


app.use(verifyAuthentication);

app.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});
app.use(authRoute);
app.use(shortenRoutes); // middleware to use router

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

