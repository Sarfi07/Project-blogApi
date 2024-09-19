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
  get_post_comments,
  post_comment,
  delete_comment,
  update_comment,
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

router.post("/posts/create", create_post);
router.get("/posts/:postId", get_post);
router.put("/posts/:postId", update_post);
router.delete("/posts/:postId", delete_post);

router.get("/posts/:postId/comments", get_post_comments);
router.post("/posts/:postId/comments", post_comment);
router.put("/posts/:postId/comments/:commentId", update_comment);
router.delete("/posts/:postId/comments/:commentId", delete_comment);

router.put("/posts/:postId/status", update_post_status);

export default router;
