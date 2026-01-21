import { Request, Response } from "express";
import { postService } from "./post.services";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const result = await postService.createPost(
      req.body,
      req.user.id as string,
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

    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 5);

    // const skip = (page - 1) * limit;

    // const sortBy = req.query.sortBy as string | undefined;
    // const sortOrder = req.query.sortOrder as string | undefined;

    // using helper function
    const options = paginationSortingHelper(req.query);

    const { page, limit, skip, sortBy, sortOrder } = options;

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

const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    // optional + type safety
    if (!postId) {
      throw new Error("Post id is required");
    }

    const result = await postService.getPostById(postId);
    res
      .status(200)
      .json({ message: "Post retreived successfully", data: result });
  } catch (error) {
    res.status(400).json({
      error: "Post retreiving failed",
      details: error,
    });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    const result = await postService.getUserPosts(authorId as string);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post retriving failed",
      details: error,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const { postId } = req.params;

    const idAdmin = user.role === UserRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      user.id,
      idAdmin,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post updating failed",
      details: error,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const { postId } = req.params;

    const idAdmin = user.role === UserRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user.id,
      idAdmin,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post deletion failed",
      details: error,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost
};
