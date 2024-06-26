import express from "express";
import {
  addComment,
  deleteComment,
  getPostComments,
} from "../controllers/comments.controller";
import { verifyJWT } from "../middleware/verifyJWT.middleware";
import { deleteCommentDB } from "../sqlQueries/comments.sqlQuery";

export const commentsRouter = express.Router();

commentsRouter.get("/", verifyJWT, getPostComments);
commentsRouter.post("/", verifyJWT, addComment);
commentsRouter.delete("/:commentId", verifyJWT, deleteComment);
