import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';

import authController from './modules/auth/auth.controller';
import postController from './modules/post/post.controller';
import userController from './modules/user/user.controller';
import chatController from './modules/chat/chat.controller';

new Elysia({prefix: "/api"})
  .use(cors())
  .use(authController)
  .use(postController)
  .use(userController)
  .use(chatController)
  .listen(Bun.env.PORT||4200)

// в localhost это не работает
  // .options('*', (res) => {
  //   console.log('Received OPTIONS request');
  //   console.log(res.set)
  //   res.set.headers['access-control-allow-origin'] = 'http://localhost:5173';
  //   res.set.headers['access-control-allow-headers'] = 'Content-Type, Authorization, Accept';
  //   res.set.status = 200;
  // })
  // .use(cors({
  //   origin: (req) => {
  //     const origin = req.headers.get("origin")!;
  //     console.log(req);
  //     console.log("headers:______________________")
  //     console.log(req.headers)
  //     console.log("_____________________________");
  //     console.log(origin === "http://localhost:5173")
  //     return origin === "http://localhost:5173";
  //   },
  // }))