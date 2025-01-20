
import type { AuthDTOSignUp, AuthDTOSignIn } from './auth.dto';
import db from "$/DBHandlers/db";
import type { Cookie } from 'elysia';
import type { IJwt, IUserJWT } from './auth';


export default abstract class ServiceAuth {
  static async verifyToken (authAccessToken:string | undefined, auth:Cookie<string | undefined>, jwt: IJwt) {
    try {
      
      if (!authAccessToken) {
        authAccessToken = auth?.value;
        if(!authAccessToken){
          return [
            new Error("Access token is missing"),
            401
          ];
        }
      }
 
      const jwtPayload = await jwt.verify(authAccessToken);
    
      if (!jwtPayload) {
        return [
          new Error("Invalid access token"),
          403
        ];
      }
      
      return await this.authJWTById(jwtPayload.sub, authAccessToken);
    } catch (err: unknown) {
      console.error("JWT verification error:", err);
      if(err instanceof Error && err.message ==='invalid signature'){
        return [
          new Error("Access token is missing"),
          401
        ];
      }
      
      return [
        new Error("Internal server error"),
        500
      ];
    }
  }
  
  static async authJWTById(sub: IUserJWT, authAccessToken:string) {
    try {
      const user= await db.auth.getUserByID(String(sub.id));
      return {
        token: authAccessToken,
        ...user,
      };
    } catch (error) {
      return [
        new Error("Invalid access token or user not found."),
        401,
      ];
    }
  }

  private static async toCreateJWTToken(jwtPayload:IUserJWT, date:number,  auth:Cookie<string | undefined>, jwt:IJwt) {
    return await jwt.sign({
      sub: jwtPayload, 
      exp: date,
    })
    .then((data) => {
      auth.set({
        value: data,
        httpOnly: true,
        maxAge: 7 * 86400
      })
    })
  }

  static async signIn(body: AuthDTOSignIn, auth:Cookie<string | undefined>, jwt:IJwt) {
    try {
      const {password, ...user} = await db.auth.getUserByEmail(body.email);
      const dePassword = await Bun.password.verifySync(body.password, password, 'bcrypt');
      const date = new Date(user.created_at).getTime() / 1000;
      await this.toCreateJWTToken(user, date, auth, jwt);

      return !dePassword ? [new Error("Invalid password"), 401] : {
        token: auth.value,
        ...user 
      };
      
    } catch (error) {
      return [
        new Error("The user with this email does not exist"),
        404
      ];
    }
  }

  static async signUp(body: AuthDTOSignUp, auth:Cookie<string | undefined>, jwt:IJwt) {
    try {
      await db.auth.getUserByEmail(body.email);
      return [
        new Error("A user with this email already exists"),
        409
      ];
    } catch (error) {
      body.password = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      const {password, ...user} = await db.auth.createUser(body);
      const date = new Date(user.created_at).getTime() / 1000;
      await this.toCreateJWTToken(user, date, auth, jwt);
      return 'The user is registered';
    }
  }
}
