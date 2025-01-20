import db from "$/DBHandlers/db";
import type { CommentDTOCreate, CommentDTOUpdate } from "../post.dto";

export default abstract class ServiceComment {
  static async createComment(data: CommentDTOCreate) {
    return db.posts.comments.createComment(data);
  }
  
  static async updateComment(data: CommentDTOUpdate) {
    return db.posts.comments.updateComment(data);
  }

  static async deleteComment(id: number) {
    return db.posts.comments.deleteComment(id);
  }
}