import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { __PROD__ } from './utils/constants';
import redis from 'redis';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

(async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'postgres',
      database: 'lireddit',
      entities: [__dirname + '/entity/*.ts', __dirname + '/entity/*.js'],
      synchronize: !__PROD__,
      logging: !__PROD__,
    });

    const app = express();

    let RedisStore = ConnectRedis(session);
    let redisClient = redis.createClient();

    app.use(
      session({
        name: 'qid',
        store: new RedisStore({ client: redisClient, disableTouch: true }),
        saveUninitialized: false,
        secret: 'dsfkdsjglkzrg',
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 2,
          httpOnly: __PROD__,
          sameSite: 'lax',
          secure: __PROD__,
        },
      })
    );

    const apollo = new ApolloServer({
      schema: await buildSchema({
        resolvers: [__dirname + '/resolver/*.ts', __dirname + '/resolver/*.js'],
        validate: false,
      }),
      context: ({ req, res }) => ({ req, res }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apollo.start();

    apollo.applyMiddleware({
      app,
      cors: { origin: 'http://localhost:3000', credentials: true },
    });

    app.listen(3001, () => {
      console.log('Server up and running at port 3001');
    });
  } catch (e) {
    console.error(e.message);
  }
})();
