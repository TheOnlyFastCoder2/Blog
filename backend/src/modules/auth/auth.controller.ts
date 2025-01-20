import { Elysia } from "elysia";
import { jwt } from '@elysiajs/jwt';
import { TJwt } from './auth'
import { AuthDTO } from './auth.dto';
import AuthService from './auth.service'
import isError from "$/utils/isError";

const test = jwt as typeof TJwt;

export default (
  new Elysia({prefix: "/auth"})
  .use(test({
    name: "jwt",
    secret: Bun.env.JWT_SECRET
  }))
  .model({
    'auth.signIn': AuthDTO.signIn,
    'auth.singUp': AuthDTO.signUp, 
  })
  .get('/verify-token', async ({jwt, error, headers, cookie: {auth}}) => {
    let authAccessToken = headers?.authorization?.replace("Bearer ", "");
    return isError(await AuthService.verifyToken(
      authAccessToken, auth, jwt
    ), error)
  })
  
  .post('/sign-in', async ({body, jwt, error, cookie: { auth }}) => {
    return isError(await AuthService.signIn(body, auth, jwt), error);
  }, {body: 'auth.signIn'})

  .post('/sign-up', async ({body, jwt, error, cookie: { auth }}) => {
   return isError(await AuthService.signUp(body, auth, jwt), error)
  }, {body: 'auth.singUp'})
)