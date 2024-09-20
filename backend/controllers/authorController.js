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

    return res.json({ posts });
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
      include: {
        author: true,
      },
    });

    return res.status(200).json({ post });
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
    console.log(req.body);
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
  const { val } = req.query;

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!post && req.user.id !== post.authorId) {
    return res.status(404).json({ message: `Post not found ${post}` });
  }

  try {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: val.toUpperCase(),
      },
    });

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    console.log(post);
    return res.json({ post });
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

export const get_post_comments = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
    });

    res.status(200).json(comments);
  } catch (err) {
    res.json(err);
  }
});

export const post_comment = [
  body("content", "Comment could be empty").trim().isLength({ min: 1 }),
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(404).json({ errors: err.array() });
    } else {
      try {
        // todo
        const { postId } = req.params;

        const newComment = await prisma.comment.create({
          data: {
            postId,
            content: req.body.content,
            authorId: req.user.id,
          },
        });

        const comment = await prisma.comment.findFirst({
          where: {
            id: newComment.id,
          },
          include: {
            author: true,
          },
        });

        return res.status(200).json({
          comment,
          message: "Comment added successfully",
        });
      } catch (err) {
        return res.status(404).json({ err, message: "Failed to post comment" });
      }
    }
  }),
];

export const update_comment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (comment && req.user.id === comment.authorId) {
      await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          content: req.body.content,
          edited: true,
        },
      });

      const updatedComment = await prisma.comment.findFirst({
        where: {
          id: commentId,
        },
        include: {
          author: true,
        },
      });

      return res.json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } else {
      return res
        .status(405)
        .json({ message: "Comment does not exist or access denied" });
    }
  } catch (err) {
    return res.status(404).json(err);
  }
});

export const delete_comment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (comment && req.user.id === comment.authorId) {
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      return res.json({ message: "Comment deleted successfully" });
    } else {
      return res.status(405).json({ message: "Comment does not exist" });
    }
  } catch (err) {
    return res.status(404).json(err);
  }
});
