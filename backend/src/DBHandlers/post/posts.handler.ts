import type { IPostProps, PostDTOCreate, PostDTOSearch, PostDTOUpdate } from "$/modules/post/post.dto";
import type { PrismaClient } from "@prisma/client";
import CommentHandler from "./comments.handler";
import LikeHandler from "./likes.handler";
import TagHandler from "./tags.handler";

export default class PostHandler  {
  readonly db: PrismaClient;
  readonly comments: CommentHandler;
  readonly likes: LikeHandler;
  readonly tags: TagHandler;

  constructor(db: PrismaClient) {
    this.comments = new CommentHandler(db);
    this.likes = new LikeHandler(db);
    this.tags = new TagHandler(db);
    this.db = db;
  }

  async getPosts(props:IPostProps , limit: number, offset: number) {
    try {
      const posts = await this.db.post.findMany({
        where: {
          AND: props.tags?.map((tagName) => ({
            tags: {
              some: {
                name: {
                  contains: tagName,
                }
              }
            }
          })),
        },
        take: limit,
        skip: offset,
        include: {
          tags: true,
          comments: true,
          likes: true,
        },
      });
      return posts;
    } catch(error) {
      console.error(`Failed to get a posts: ${error}`);
      return "Failed to get a posts: maybe incorrect props";
    }
  }

  async getPostById(postId: number) {
    try {
      const post = await this.db.post.findUniqueOrThrow({
        where: {id:postId},
        include: {
          tags: true,
        },
      });
      return post;
    } catch(error) {
      console.error(`Failed to get a post by id: ${error}`);
      return [
        new Error(`Failed to get a post by id:\n\n ${error}`),
        404
      ];
    }
  }

  async searchPosts(props:PostDTOSearch) {
    try {
      const posts = await this.db.post.findMany({
        where: {
          OR: [
            { title: { contains: props.title} },
          ],
        },
        take: Number(props.limit),
        include: {
          tags: true,
          comments: true,
        },
      });
      return posts;
    } catch(error) {
      console.error(`Failed to search a posts: ${error}`);
      return "Failed to search a posts: maybe incorrect data";
    }
  }

  async createPost(data: PostDTOCreate) {
    try {
      const post = await this.db.post.create({
        data: {
          ...data,
          created_at: new Date(),
          update_at: new Date(),
          tags: {
            connectOrCreate: data.tags?.map(tagName => ({
              where: { name: tagName },
              create: { name: tagName },
            })) || [],
          },
        },
      });
  
      return post;
    } catch (error) {
      console.error(`Failed to create a post: ${error}`);
      return `Failed to create a post: ${error}`;
    }
  }

  async updatePost(data: PostDTOUpdate) {
    try {
      const currentPost = await this.db.post.findUnique({
        where: { id: data.id },
        select: { tags: true },
      });

      if (!currentPost) {
        return [
          new Error(`Post with id ${data.id} not found`),
          404
        ];
      }

      await this.db.post.update({
        where: { id: data.id },
        data: {
          ...data,
          tags: {
            disconnect: currentPost.tags.map(tag => ({ id: tag.id })),
            connectOrCreate: data.tags?.map(tagName => ({
              where: { name: tagName },
              create: { name: tagName },
            })) || [],
          },
        },
      });
      
      return "the post was updated successfully";
    } catch (error) {
      console.error(`Failed to update a post: ${error}`);
      return [
        new Error(`Post with id ${data.id} not found`),
        404
      ];
    }
  }

  async deletePost(id: number) {
    try {
      await this.db.post.delete({
        where: {id},
      });
      
      return "the post was deleted successfully";
    } catch (error) {
      console.error(`Failed to delete a post: ${error}`);
      return [
        new Error(`Failed to delete a post: maybe incorrect id`),
        404
      ];
    }
  }
}