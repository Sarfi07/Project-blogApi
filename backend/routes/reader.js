// routes/readerRoutes.js
import express from "express";
import authMiddleware from "../utils/authMiddleware.js";
import authorizationMiddleware from "../utils/authorizationMiddleware.js";
import {
  get_posts,
  get_post,
  get_comments,
  get_comment,
  post_comment,
  update_comment,
  delete_comment,
} from "../controllers/readerController.js";

const router = express.Router();

// Apply authentication and authorization middleware
router.use(authMiddleware);
router.use(authorizationMiddleware("READER"));

// Define reader-specific routes
router.get("/home", (req, res) => {
  res.send("Reader Home");
});

// get all posts
router.get("/posts", get_posts);

//get specific posts
router.get("/posts/:postId", get_post);

router.get("/posts/:postId/comments", get_comments);
router.post("/posts/:postId/comments", post_comment);

router.get("/posts/:postId/comments/:commentId", get_comment);
router.delete("/posts/:postId/comments/:commentId", delete_comment);
router.put("/posts/:postId/comments/:commentId", update_comment);

export default router;
