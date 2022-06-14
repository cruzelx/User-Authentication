import app from "./app";
import dotenv from "dotenv";
import http from "http";

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { mongoDataSource } from "./config/mongo.datasource";

// remove later
import { Resolvers } from "./components/index";
import { buildSchema } from "type-graphql";
dotenv.config();

const { SERVER_PORT } = process.env;

const bootstrap = async (resolvers: any): Promise<void> => {
  await mongoDataSource
    .initialize()
    .then(() => console.log("Connected to mongodb"))
    .catch(() => console.log("couldn't connect to mongodb"));

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
    }),
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      return { req };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    path: "/graphql/api/",
    cors: true,
    bodyParserConfig: true,
  });
  await new Promise<void>((resolve) => httpServer.listen(SERVER_PORT, resolve));
  console.log(
    `Listening on localhost:${SERVER_PORT}${apolloServer.graphqlPath}`
  );
};

bootstrap(Resolvers);
