import { UserService } from "@Service/userService";

export const userResolvers = {
  User: {
    __resolveReference: (ref: { id: string }) => UserService.getUserById(ref.id),
    organizations: async (parent: any) => UserService.getUserOrganizations(parent.id),
  },

  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return UserService.getUserById(context.user.id);
    },
    user: (_: any, { id }: { id: string }) => UserService.getUserById(id),
    invitations: async (_: any, __: any, context: any) => {
      if (!context.user) return [];
      return UserService.getUserInvitations(context.user.id);
    },
  },

  Mutation: {
    register: async (_: any, { email, password, name }: { email: string; password: string; name?: string }) => {
      return UserService.register(email, password, name);
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      return UserService.login(email, password);
    },
    applyMembership: async (_: any, { orgId }: { orgId: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return UserService.applyMembership(context.user.id, orgId);
    },
    inviteUser: async (_: any, { email, orgId }: { email: string; orgId: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return UserService.inviteUser(context.user.id, email, orgId);
    },
  },
};