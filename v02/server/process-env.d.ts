export {}
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        COOKIE_SECRET: string;
        TOKEN_SECRET: string;
        // add more environment variables and their types here
      }
    }
  }