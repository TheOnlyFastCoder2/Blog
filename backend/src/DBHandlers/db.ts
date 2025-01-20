import { PrismaClient } from '@prisma/client';
import AuthHandler from './auth.handler';
import PostHandler from './post/posts.handler';
import UserHandler from './user.handler';
import ChatHandler from './chat.handler';


export const prisma = new PrismaClient();
export default {
  auth: new AuthHandler(prisma),
  posts: new PostHandler(prisma),
  users: new UserHandler(prisma),
  chats: new ChatHandler(prisma),
}
