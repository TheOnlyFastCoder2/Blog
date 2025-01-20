declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    BCRYPT_SECRET: string;
  }
}