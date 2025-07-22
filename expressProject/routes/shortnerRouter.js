import { Router } from 'express';
import { postURLShortner, getShortnerPage, redirectToShortLinks } from '../controllers/postShortner.controller.js';

const router = Router();

// Home route to display index.html with links inserted
router.get('/', getShortnerPage);

router.post('/', postURLShortner);
// POST route to add URL and shortcode in json

//  Route to redirect based on shortCode
router.get("/:shortcode", redirectToShortLinks);



// Named export;
export const shortenRoutes = router;

