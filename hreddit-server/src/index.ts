import "reflect-metadata";
import { __prod__ } from "./constant";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolver/postResolver";
import { UserResolver } from "./resolver/user-resolver";
import cors from "cors";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import Session from "express-session";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "hredditdb2",
    username: "postgres",
    password: "Anhdasai123",
    entities: [Post, User],
    logging: true,
    synchronize: true, //Auto migration
    migrations: [path.join(__dirname, "./migrations/*")],
  });
  await conn.runMigrations();

  const app = express();
  let RedisStore = connectRedis(Session);
  let redis = new Redis();
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    Session({
      name: "qid",
      store: new RedisStore({ client: redis, disableTouch: false }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: !__prod__,
        sameSite: "lax", //csrf
      },
      secret: "asdfasdfasdfasdfasdfasdfasdf",
      resave: false,
    })
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }): any => ({
      //context can be accessible by any Resolver
      req,
      res,
      redis,
    }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("this server is running");
  });
};
main().catch((error) => {
  console.error(error);
});
