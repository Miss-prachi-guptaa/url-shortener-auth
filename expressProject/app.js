import express from 'express';
import { shortenRoutes } from './routes/shortnerRouter.js';

const app = express();
const PORT = 3002;


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // middleware 

app.set("view engine", "ejs");
app.set("views", "./views"); // by default it read content of views frolder ..but we have already this folder ..so dont need it here ..if we have another name and folder to define it ..ejs read value from there..

app.use(shortenRoutes);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
