export {}
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        COOKIE_SECRET: string;
        ACCESS_TOKEN_SECRET: string;
        // add more environment variables and their types here
      }
    }
  }