import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { organisationResolvers } from "@GraphQl/orgResolver";
import { organisationTypeDefs } from "@GraphQl/orgSchema";
import { OrgService } from "@Service/orgService";

dotenv.config();

const schema = buildSubgraphSchema({
  typeDefs: organisationTypeDefs,
  resolvers: organisationResolvers,
});

const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 9002 },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    let user = null;

    if (authHeader.startsWith("Bearer ")) {
      try {
        const payload: any = jwt.verify(
          authHeader.replace(/^Bearer\s+/i, ""),
          process.env.JWT_SECRET!
        );
        // user = payload.userId ? await OrgService.getUserById(payload.userId) : null;
      } catch (err) {
        console.error("JWT verification failed:", err);
      }
    }

    return { user };
  },
});

console.log(`Organization Service running at ${url}`);
