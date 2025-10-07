import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  enum InvitationResponse {
    ACCEPT
    REJECT
  }

  type User @key(fields: "id") {
    id: ID!
    email: String!
    username: String
    organizations: [UserOrganization!]!
  }

  type UserOrganization {
    organization_id: ID!
    role: String
    status: String
  }

  type UserInvitation {
    id: ID!
    inviter_id: ID!
    invitee_email: String!
    organization_id: ID!
    status: String
    created_at: String
    expires_at: String
  }

  type AuthPayload {
    token: String
    user: User!
  }

  type Query {
    me: User
    user(id: ID!): User
    invitations: [UserInvitation!]!
  }

  type Mutation {
    register(email: String!, password: String!, username: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    applyMembership(orgId: ID!): Boolean!
    inviteUser(email: String!, orgId: ID!): Boolean!
    respondToInvitation(token: String!, response: InvitationResponse!): Boolean!
  }

  extend type Organization @key(fields: "id") {
    id: ID! @external
  }
`;