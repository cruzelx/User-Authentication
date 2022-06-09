import app from "./app";
import dotenv from "dotenv";
import http from "http";
import _ from "lodash";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { mongoDataSource } from "./config/mongo.datasource";

// remove later
import { userSchema } from "./components/users/users.schema";
import { UserResolver } from "./components/users/users.resolver";
import { buildSchema, BuildSchemaOptions } from "type-graphql";
dotenv.config();

const { SERVER_PORT } = process.env;

const bootstrap = async (resolver: any): Promise<void> => {
  mongoDataSource
    .initialize()
    .then(() => {
      console.log(`connected to mongodb database`);
    })
    .catch((error) => {
      console.log(`error connecting to database stack trace: ${error}`);
      process.exit(1);
    });
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [resolver],
    }),
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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

bootstrap(UserResolver);
