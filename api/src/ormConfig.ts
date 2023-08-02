import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const ormConfig = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
    // "migrations": ["dist/src/migration/**/*.js"],
    // "subscribers": ["dist/src/subscriber/**/*.js"],
    // "cli": {
    //   "entitiesDir": "dist/src/entity",
    //   "migrationsDir": "dist/src/migration",
    //   "subscribersDir": "dist/src/subscriber"
    // }
};