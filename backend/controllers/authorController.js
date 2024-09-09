import prisma from "../utils/prismaClient.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

// get all post by author
export const get_posts = asyncHandler(async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: req.user.id,
      },
    });

    return res.json(posts);
  } catch (err) {
    return res.status(404).json({ message: "Posts not found" });
  }
});

export const get_post = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findFirst({
      where: {
        authorId: req.user.id,
        id: postId,
      },
    });

    return res.json(post);
  } catch (err) {
    return res.status(404).json({ message: "Post not found" });
  }
});

// add new post
export const create_post = [
  body("content", "Content cannot be empty").trim().isLength({ min: 1 }),
  body("title", "title cannot be empty").trim().isLength({ min: 1 }),
  asyncHandler(async (req, res) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(417).json(err);
    }

    try {
      const { title, content } = req.body;
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          authorId: req.user.id,
        },
      });

      return res
        .status(200)
        .json({ newPost, message: "Post created successfully" });
    } catch (err) {
      return res.status(404).json(err);
    }
  }),
];

// update status
export const update_post_status = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { statusVal } = req.body;

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!post && req.user.id !== post.authorId) {
    return res.status(404).json({ message: "Post not found" });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: statusVal.toUpperCase(),
      },
    });

    return res.json({ updatedPost });
  } catch (err) {
    return res.status(404).json(err);
  }
});

// update post
export const update_post = [
  body("content", "Content cannot be empty").trim().isLength({ min: 1 }),
  body("title", "title cannot be empty").trim().isLength({ min: 1 }),
  asyncHandler(async (req, res) => {
    const err = validationResult(req);
    console.log(req.body);

    if (!err.isEmpty()) {
      return res.status(417).json(err);
    }

    try {
      const { title, content } = req.body;
      const { postId } = req.params;
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title,
          content,
        },
      });

      return res
        .status(200)
        .json({ postId: updatedPost.id, message: "Post updated successfully" });
    } catch (err) {
      return res.status(404).json(err);
    }
  }),
];

// delete post
export const delete_post = asyncHandler(async (req, res) => {
  // todo
  const { postId } = req.params;

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!post && req.user.id !== post.authorId) {
    return res.status(401).json({ message: "Post not found" });
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return res.json({ message: "Post delete successfully" });
});
