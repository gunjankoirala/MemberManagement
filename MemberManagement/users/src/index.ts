import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userResolvers } from "@GraphQl/userResolver";
import { userTypeDefs } from "@GraphQl/userSchema";
import { UserService } from "@Service/userService";

dotenv.config();

const schema = buildSubgraphSchema({
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
});

const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4001 },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    let user = null;
    if (authHeader.startsWith("Bearer ")) {
      try {
        const payload: any = jwt.verify(
          authHeader.replace(/^Bearer\s+/i, ""),
          process.env.JWT_SECRET!
        );
        user = await UserService.getUserById(payload.id);
      } catch {
        user = null;
      }
    }
    return { user };
  },
});

console.log(`User Service running at ${url}`);
