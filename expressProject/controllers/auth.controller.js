import { createUser, getUserBYEmail } from "../services/auth.services.js";

export const getRegistrationPage = (req, res) => {
  return res.render("auth/register");
}

export const postRegistrationPage = async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;

  //**check this email exist in db already ..if already exist then redirect again yto register page
  const userExist = await getUserBYEmail(email);
  if (userExist) return res.redirect("/register");

  // if this email is unique then add it to our databse 
  const user = await createUser({ name, email, password });
  console.log(user)

  res.redirect("/login")
}
export const getLoginPage = (req, res) => {
  return res.render("auth/login");
}

export const postLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserBYEmail(email); // check email exist in db or not
  console.log("user", user)
  if (!user) return res.redirect("/login");// if email not exist stay on login page

  if (user.password != password) return res.redirect("/login"); // if password of that email not match 

  res.cookie("isLoggedIn", true)
  res.redirect("/") // else redirect to now home page
}