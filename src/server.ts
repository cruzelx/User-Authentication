import app from "./app";
import dotenv from "dotenv";
import "reflect-metadata";

import { ApolloServer, ForbiddenError } from "apollo-server-express";
import { mongoDataSource } from "./config/mongo.datasource";

import jwt from "jsonwebtoken";

// remove later
import { Resolvers } from "./components/index";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from "./middlewares/custom-auth-checker.middleware";
dotenv.config();

const { SERVER_PORT } = process.env;

const bootstrap = async (resolvers: any): Promise<void> => {
  mongoDataSource
    .initialize()
    .then(() => console.log("Connected to mongodb"))
    .catch(() => console.log("couldn't connect to mongodb"));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      authChecker: customAuthChecker,
      authMode: "null",
    }),

    csrfPrevention: true,
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer:app })],
    context: ({ req }) => {
      let userPayload = null;
      const auth = req.headers.authorization;
      const token = auth && auth.split(" ")[1];
      if (token) {
        const verifiedData = jwt.decode(token);
        userPayload = verifiedData;
      }
      return { req, userPayload };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/graphql/api/",
    cors: true,
    bodyParserConfig: true,
  });
  app.listen(SERVER_PORT, () => console.log("Listening on localhost"));
  // await new Promise<void>((resolve) => app.listen(SERVER_PORT, resolve));
  // console.log(
  //   `Listening on localhost:${SERVER_PORT}${apolloServer.graphqlPath}`
  // );
};

bootstrap(Resolvers);
