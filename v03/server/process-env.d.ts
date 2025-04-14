export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PASSWORD: string;
      COOKIE_SECRET: string;
      TOKEN_SECRET: string;
      // add more environment variables and their types here
    }
  }
}