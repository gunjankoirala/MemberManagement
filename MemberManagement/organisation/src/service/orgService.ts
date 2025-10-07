import { getDB } from "@Database";
import { organisation } from "@Schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const OrgService = {
  async getOrganisationById(id: string) {
    const db = await getDB();
    const rows = await db.select().from(organisation).where(eq(organisation.id, id)).limit(1);
    return rows[0] ?? null;
  },

  async getAllOrganisations() {
    const db = await getDB();
    return db.select().from(organisation);
  },

  async createOrganisation(name: string, description?: string) {
    const db = await getDB();
    const id = uuidv4();

    await db.insert(organisation).values({
      id,
      name,
      description,
    });

    return this.getOrganisationById(id);
  },

  async updateOrganisation(id: string, name?: string, description?: string) {
    const db = await getDB();

    await db
      .update(organisation)
      .set({
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
      })
      .where(eq(organisation.id, id));

    return this.getOrganisationById(id);
  },

  async deleteOrganisation(id: string) {
    const db = await getDB();
    await db.delete(organisation).where(eq(organisation.id, id));
    return true;
  },
};
