import { Request, Response } from "express";
import { postService } from "./post.services";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const result = await postService.createPost(
      req.body,
      req.user.id as string
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // true or false and default false in the spelling is also wrong
    // const isFeatured = req.query.isFeatured
    //   ? req.query.isFeatured === "true"
    //   : undefined;

    // only true or false else default false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);

    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(201).json({
      message: "All posts retreived successfully",
      posts: result,
    });
  } catch (error) {
    res.status(400).json({
      error: "Post retriving failed",
      details: error,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
