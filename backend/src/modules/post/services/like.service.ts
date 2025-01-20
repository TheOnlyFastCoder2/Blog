import db from "$/DBHandlers/db";
import type { LikeDTOAction } from "../post.dto";

export default abstract class ServiceLike {
  static async createLike(data: LikeDTOAction) {
    return db.posts.likes.createLike(data);
  }
  
  static async deleteLike(data: LikeDTOAction) {
    data.postId = Number(data.postId);
    data.userId = Number(data.userId);
    return db.posts.likes.deleteLike(data);
  }
}