import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get("/author-posts", postController.getUserPosts);

router.get("/:postId", auth(UserRole.USER), postController.getPostById);

router.post("/", auth(UserRole.USER), postController.createPost);

router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.updatePost,
);

router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.deletePost,
);

export const postRouter: Router = router;
