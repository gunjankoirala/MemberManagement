import { OrgService } from "@Service/orgService";

export const organisationResolvers = {
  Organization: {
    __resolveReference: (ref: { id: string }) => OrgService.getOrganisationById(ref.id),
  },

  Query: {
    organizations: () => OrgService.getAllOrganisations(),
    organization: (_: any, { id }: { id: string }) => OrgService.getOrganisationById(id),
  },

  Mutation: {
    createOrganization: (_: any, { name, description }: { name: string; description?: string }) =>
      OrgService.createOrganisation(name, description),

    updateOrganization: (_: any, { id, name, description }: { id: string; name?: string; description?: string }) =>
      OrgService.updateOrganisation(id, name, description),

    deleteOrganization: (_: any, { id }: { id: string }) => OrgService.deleteOrganisation(id),
  },
};
