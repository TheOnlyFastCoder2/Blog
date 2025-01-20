import type { AuthDTOSignUp, AuthDTOSignIn } from "$/modules/auth/auth.dto";
import type { PrismaClient } from "@prisma/client";

export default class AuthHandler {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createUser({
    username,
    email,
    password,
  }: AuthDTOSignUp)  {
    try {
      const user = await this.db.user.create({
        data: {
          username,
          email,
          password,
          created_at: new Date(),
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to create a user: ${error}`);
    }
  }

  async getUserByEmail(email: AuthDTOSignIn["email"]) {
    try {
      const user = await this.db.user.findUniqueOrThrow({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to verify the user: ${error}`);
    }
  }

  async getUserByID(userID: string) {
    try {
      const user = await this.db.user.findUniqueOrThrow({
        where: { id: Number(userID) },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to verify the user: ${error}`);
    }
  }
}
