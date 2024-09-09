// routes/authorRoutes.js
import express from "express";
import authMiddleware from "../utils/authMiddleware.js";
import authorizationMiddleware from "../utils/authorizationMiddleware.js";
import {
  get_post,
  get_posts,
  create_post,
  update_post,
  update_post_status,
  delete_post,
} from "../controllers/authorController.js";

const router = express.Router();

// Apply authentication and authorization middleware
router.use(authMiddleware);
router.use(authorizationMiddleware("AUTHOR"));

// Define author-specific routes
router.get("/dashboard", (req, res) => {
  res.send("Author Dashboard");
});

router.get("/posts", get_posts);
router.get("/posts/:postId", get_post);

router.post("/posts/create", create_post);
router.post("/posts/:postId/update", update_post);
router.post("/posts/:postId/update/status", update_post_status);
router.post("/posts/:postId/delete", delete_post);

export default router;
