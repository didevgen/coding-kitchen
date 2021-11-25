import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import * as cors from 'cors';
import { config } from 'dotenv';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer, Server } from 'http';
import Redis from 'ioredis';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { WHITELISTED_QUERIES } from './common/whitelistedQuery';
import connect from './db/mongoose.client';
import schema from './schema';

config();

async function tradeTokenForUser(token: string) {
  const userObj = JSON.parse(await redis.get(token));
  return userObj ? userObj : null;
}

export const redis = new Redis({ host: process.env.REDIS_HOST });

export default async (port: number): Promise<Server> => {
  const app = express();

  const server: Server = createServer(app);

  app.use('*', cors({ origin: 'http://localhost:3000' }));

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    context: async ({ req }) => {
      if (WHITELISTED_QUERIES.includes(req.body.operationName)) {
        return {
          ...req,
          redis
        };
      }

      let authToken = null;
      let currentUser = null;
      try {
        authToken = req.headers.authorization || '';
        currentUser = await tradeTokenForUser(authToken);
      } catch (e) {
        console.warn(`Unable to authenticate using auth token: ${authToken}`);
      }

      if (!currentUser) {
        throw new AuthenticationError('you must be logged in');
      }

      return {
        ...req,
        authToken,
        currentUser,
        redis
      };
    }
  });

  await apolloServer.start();

  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const db = process.env.MONGODB_URI;
  connect({ db });

  return new Promise<Server>(resolve => {
    server.listen(port, () => {
      // tslint:disable-next-line
      new SubscriptionServer(
        {
          execute,
          schema,
          subscribe
        },
        {
          path: '/subscriptions',
          server
        }
      );
      resolve(server);
    });
  });
};
