import prisma from "../utils/prismaClient.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

export const get_posts = asyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
  });

  res.json({ posts });
});

export const get_post = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        status: "PUBLISHED",
      },
      include: {
        comments: true,
        author: true,
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    });

    if (post) {
      res.json({ post, user });
    } else {
      res.json({ user });
    }
  } catch (err) {
    res.json(err);
  }
});

export const get_comments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: true,
      },
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json(err);
  }
});

export const get_comment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });
    res.json(comment);
  } catch (err) {
    res.status(404).json(err);
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
