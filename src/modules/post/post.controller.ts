import { Request, Response } from "express";
import { postService } from "./post.services";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body);
    res.status(201).json(result);
    console.log("hitting controller");
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.getAllPosts();
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
