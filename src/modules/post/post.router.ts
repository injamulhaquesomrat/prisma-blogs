import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get("/author-posts", postController.getUserPosts);

router.get("/:postId", auth(UserRole.USER), postController.getPostById);

router.post("/", auth(UserRole.USER), postController.createPost);

export const postRouter: Router = router;
