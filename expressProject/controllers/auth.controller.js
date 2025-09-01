import { ACCESS_TOKEN_EXPIRY } from "../config/constant.js";
import { createUser, getUserBYEmail, hashPassword, comparePassword, createSessions, createRefreshToken, createAccessToken, clearUserSession, authenticateUser, findUserById, getAllShortLinks, generateRandomToken } from "../services/auth.services.js";
import { LoginUserSchema, registerUserSchema } from "../validators/auth-validators.js";



export const getRegistrationPage = (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("auth/register", { errors: req.flash("errors") });
}

export const postRegistrationPage = async (req, res) => {
  if (req.user) return res.redirect("/");


  // const { name, email, password } = req.body;
  const result = registerUserSchema.safeParse(req.body);
  console.log(result.data)

  if (!result.success) {
    console.log(result.error.issues)
    const errorMessage = result.error.issues[0]?.message;

    req.flash("errors", errorMessage); // passing array of messages
    return res.redirect("/register");
  }

  // continue with registration logic
  const { name, email, password } = result.data;

  const userExist = await getUserBYEmail(email);
  // if (userExist) return res.redirect("/register");
  if (userExist) {
    req.flash("errors", "User alreasy exists")
    return res.redirect("/register");
  }

  const hashedPassword = await hashPassword(password);

  const [user] = await createUser({ name, email, password: hashedPassword });
  console.log(user);

  await authenticateUser({ req, res, user, name, email });

  res.redirect("/") // else redirect to now home page
}
export const getLoginPage = (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("auth/login", { errors: req.flash("errors") });
}

export const postLogin = async (req, res) => {
  if (req.user) return res.redirect("/");

  // const { email, password } = req.body;
  const result = LoginUserSchema.safeParse(req.body);
  console.log(result.data)

  if (!result.success) {
    console.log(result.error.issues)
    const errorMessage = result.error.issues[0]?.message;

    req.flash("errors", errorMessage); // passing array of messages
    return res.redirect("/login");
  }
  const { email, password } = result.data;

  const user = await getUserBYEmail(email); // check email exist in db or not
  console.log("user", user)
  if (!user) {
    req.flash("errors", "Invalid user or password")
    return res.redirect("/login");

  }
  const idPasswordValid = await comparePassword(password, user.password);

  if (!idPasswordValid) {
    req.flash("errors", "Invalid user or password")
    return res.redirect("/login");

  }

  await authenticateUser({ req, res, user });

  res.redirect("/profile") // else redirect to now home page
}

export const getMe = (req, res) => {
  if (!req.user) return res.send("Not logged in");
  return res.send(`<h1>Hey ${req.user.name}- ${req.user.email}</h1>`)
}

export const logoutUser = async (req, res) => {

  await clearUserSession(req.user.sessionId)
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect("/login")
};

export const getProfilePage = async (req, res) => {
  if (!req.user) return res.send("Not Logged In");

  const user = await findUserById(req.user.id);
  if (!user) return res.redirect("/login");

  const userShortLinks = await getAllShortLinks(user.id);

  return res.render("auth/profile", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailVaild: user.isEmailValid,
      createdAt: user.createdAt,
      links: userShortLinks,

    },
  });
}

export const getVerifyEmailPage = async (req, res) => {
  //  !(user is logged in)= false || isEmailValid = false  then page render 
  // if (!req.user || req.user.isEmailVaild) return res.redirect('/');
  if (!req.user) return res.redirect('/');
  const user = await findUserById(req.user.id);
  if (!user || user.isEmailValid) return res.redirect('/');

  return res.render("auth/verify-email", {
    email: req.user.email,
  })
}

export const resendVerificationLink = async (req, res) => {
  if (!req.user) return res.redirect('/');
  const user = await findUserById(req.user.id);
  if (!user || user.isEmailValid) return res.redirect('/');

  const randomToken = generateRandomToken()
}