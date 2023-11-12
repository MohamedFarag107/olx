// global environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: number;
    DATABASE_URL: string;
  }
}
