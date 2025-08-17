import { Router } from 'express';
import { postURLShortner, getShortnerPage, redirectToShortLinks, getShortnerEditPage, postShortnerEditPage } from '../controllers/postShortner.controller.js';

const router = Router();

// Home route to display index.html with links inserted
router.get('/', getShortnerPage);

router.post('/', postURLShortner);
// POST route to add URL and shortcode in json

//  Route to redirect based on shortCode
router.get("/:shortcode", redirectToShortLinks);

router.route("/edit/:id").get(getShortnerEditPage).post(postShortnerEditPage);

// router.route("/delete/:id").post(deleteShortCode)
// Named export;
export const shortenRoutes = router;

