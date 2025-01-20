import type { CommentDTOCreate, CommentDTOUpdate } from "$/modules/post/post.dto";

import type { PrismaClient } from "@prisma/client";

export default class CommentHandler {
    readonly db: PrismaClient;
    
    constructor(db: PrismaClient) {
      this.db = db;
    }

    async createComment(data: CommentDTOCreate) {
      try {
        const comment = await this.db.comment.create({
          data: {
            ...data,
            created_at: new Date(),
            update_at: new Date(),
          }
        });
        
        return comment;
      } catch (error) {
        console.error(`Failed to create a comment: ${error}`);
        return [
          new Error(`Failed to create a comment: ${error}`),
          409
        ];
      }
    }

    async updateComment(data: CommentDTOUpdate) {
      try {
        const comment = await this.db.comment.update({
          where: {
            author_id_post_id: {
              author_id: data.author_id,
              post_id: data.post_id
            },
          },
          data: {
            ...data,
            update_at: new Date(),
          }
        });

        return comment;
      } catch (error) {
        console.error(`Failed to update a comment: ${error}`);
        return [
          new Error(`Failed to update a comment: maybe incorrect id`),
          409,
        ];
      }
    }

    async deleteComment(id: number) {
      try {
        await this.db.comment.delete({
          where: {id}
        });
        return "the comment was deleted successfully";
      } catch (error) {
        console.error(`Failed to delete a comment: ${error}`);
        return [
          new Error(`Failed to delete a comment: maybe incorrect id`),
          404,
        ];
      }
    }
}
