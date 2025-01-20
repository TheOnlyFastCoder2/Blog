import db from "$/DBHandlers/db";
import type {  PostDTOCreate, PostDTOGet, PostDTOSearch, PostDTOUpdate } from './post.dto';

export default abstract class ServicePost {

  static async getPosts(data: PostDTOGet) {
    const { limit, page, ...props} = data;
    const offset = (page - 1) * limit;
    const tags = props.tags ? props.tags.split(',') : [];

    return db.posts.getPosts({...props, tags}, Number(limit), offset);
  }
  
  static async getPostById(postId:number) {
    return db.posts.getPostById(Number(postId));
  }

  static async createPost(data: PostDTOCreate) {
    return db.posts.createPost(data);
  }

  static async updatePost(data: PostDTOUpdate) {
    const resp = await db.posts.updatePost(data);
    await db.posts.tags.deleteUnusedTags();
    return resp;
  }

  static async searchPost(data: PostDTOSearch) {
    return db.posts.searchPosts(data);
  }

  static async deletePost(id:number) {
    const resp = await db.posts.deletePost(id);
    await db.posts.tags.deleteUnusedTags();
    return resp;
  }
}
