import type { IPostProps, PostDTOCreate, PostDTOSearch, PostDTOUpdate } from "$/modules/post/post.dto";
import type { PrismaClient } from "@prisma/client";
import CommentHandler from "./comments.handler";
import LikeHandler from "./likes.handler";

export default class TagHandler  {
  readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async deleteUnusedTags() {
    try {
      const unusedTags = await this.db.tag.findMany({
        where: {
          posts: {
            none: {},
          },
        },
      });
      if (unusedTags.length > 0) {
        await this.db.tag.deleteMany({
          where: {
            id: {
              in: unusedTags.map(tag => tag.id),
            },
          },
        });
      }
    } catch(error) {
      throw new Error(`Failed to delete tags: ${error}`);
    }
  }

  async getTags() {
    try {
      const tags = await this.db.tag.findMany();
      return tags;
    } catch (error) {
      throw new Error(`Failed to find tags: ${error}`);
    }
  }
}