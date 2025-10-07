import { gql } from "graphql-tag";

export const organisationTypeDefs = gql`
  type Organization @key(fields: "id") {
    id: ID!
    name: String!
    description: String
    created_at: String
    updated_at: String
  }

  type Query {
    organizations: [Organization!]!
    organization(id: ID!): Organization
  }

  type Mutation {
    createOrganization(name: String!, description: String): Organization!
    updateOrganization(id: ID!, name: String, description: String): Organization
    deleteOrganization(id: ID!): Boolean!
  }
`;
