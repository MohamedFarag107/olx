// global environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: number;
    DATABASE_URL: string;
    CORS_ORIGIN: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    COOKIE_SECRET: string;
    COOKIE_NAME: string;
    BCRYPT_SALT: string;
  }
}

// express
declare namespace Express {
  interface Request {
    user?: {
      id: string;
    };
  }
}
