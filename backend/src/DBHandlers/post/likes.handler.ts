import type { LikeDTOAction} from "$/modules/post/post.dto";

import type { PrismaClient } from "@prisma/client";

export default class LikeHandler {
    readonly db: PrismaClient;
    
    constructor(db: PrismaClient) {
      this.db = db;
    }

    async createLike({userId, postId}: LikeDTOAction) {
      try {
        const existingLike = await this.db.like.findUnique({
          where: {
            userId_postId: {
              userId: userId,
              postId: postId,
            },
          },
        });
    
        if (existingLike) {
          console.error('The user has already liked this post');
          return [
            new Error(`The user has already liked this post`),
            409,
          ]
        }

        await this.db.like.create({
          data: {
            userId: userId,
            postId: postId,
          },
        });
      } catch (error) {
        console.error('Error when liking a post:', error);
        return [
          new Error(`Error when liking a post: ${error}`),
          400,
        ]
      }
    }

    async deleteLike({userId, postId}: LikeDTOAction) {
      try {
        const existingLike = await this.db.like.findUnique({
          where: {
            userId_postId: {
              userId: userId,
              postId: postId,
            },
          },
        });

        if (!existingLike) {
          console.error('The user did not like this post.');
          return [
            new Error(`The user did not like this post.`),
            404,
          ];
        }

        await this.db.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } catch (error) {
        console.error(`Error when deleting a like: ${error}`);
        return [
          new Error(`Error when deleting a like: ${error}`),
          500,
        ];
      }
    }
}
