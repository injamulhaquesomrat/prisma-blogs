import { Request, Response } from "express";
import { postService } from "./post.services";

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

    const result = await postService.getAllPosts({
      search: searchString,
      tags,
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
