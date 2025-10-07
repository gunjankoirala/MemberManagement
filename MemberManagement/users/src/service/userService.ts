import { getDB } from "@Database";
import { user, user_organization, user_invitation } from "@Schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import {
  UserAlreadyExistsError,
  UserCreationFailedError,
  InvalidCredentialsError,
  MissingEnvVarError,
  MembershipAlreadyExistsError,
  InvitationFailedError,
  AuthTokenError,
} from "@Error";

export const UserService = {
  genId() {
    return uuidv4();
  },

  signToken(payload: object) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new MissingEnvVarError("JWT_SECRET");

    const JWT_EXPIRES_IN =
      (process.env.JWT_EXPIRES_IN ?? "7d") as unknown as jwt.SignOptions["expiresIn"];

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verifyToken(token: string) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new MissingEnvVarError("JWT_SECRET");

    try {
      return jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
      throw new AuthTokenError();
    }
  },

  async createUser({
    id,
    email,
    password,
    name,
  }: {
    id: string;
    email: string;
    password: string;
    name?: string;
  }) {
    const db = await getDB();
    const password_hash = await bcrypt.hash(password, 10);
    await db.insert(user).values({ id, email, password_hash, username: name });

    const created = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return created[0] ?? null;
  },

  async findByEmail(email: string) {
    const db = await getDB();
    const rows = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return rows[0] ?? null;
  },

  async findById(id: string) {
    const db = await getDB();
    const rows = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return rows[0] ?? null;
  },

  async verifyPassword(storedHash: string, password: string) {
    return bcrypt.compare(password, storedHash);
  },

  async register(email: string, password: string, name?: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new UserAlreadyExistsError();

    const id = this.genId();
    const newUser = await this.createUser({ id, email, password, name });
    if (!newUser) throw new UserCreationFailedError();

    return { user: newUser };
  },

  async login(email: string, password: string) {
    const foundUser = await this.findByEmail(email);
    if (!foundUser) throw new InvalidCredentialsError();

    const valid = await this.verifyPassword(foundUser.password_hash, password);
    if (!valid) throw new InvalidCredentialsError();

    const token = this.signToken({ userId: foundUser.id });
    return { token, user: foundUser };
  },

  async getUserById(id: string) {
    return this.findById(id);
  },

  async getUserOrganizations(userId: string) {
    const db = await getDB();
    return db
      .select()
      .from(user_organization)
      .where(eq(user_organization.user_id, userId));
  },

  async getUserInvitations(userId: string) {
    const db = await getDB();
    const userRecord = await this.getUserById(userId);
    if (!userRecord) return [];
    return db
      .select()
      .from(user_invitation)
      .where(eq(user_invitation.invitee_email, userRecord.username ?? userRecord.email));
  },

  async applyMembership(userId: string, orgId: string) {
    const db = await getDB();

    const existing = await db
      .select()
      .from(user_organization)
      .where(
        and(
          eq(user_organization.user_id, userId),
          eq(user_organization.organization_id, orgId)
        )
      )
      .limit(1);

    if (existing.length > 0) throw new MembershipAlreadyExistsError();

    await db.insert(user_organization).values({
      id: this.genId(),
      user_id: userId,
      organization_id: orgId,
      role: "member",
      status: "pending",
      created_at: new Date(),
    });

    return true;
  },

  async inviteUser(inviterId: string, inviteeEmail: string, orgId: string) {
    const db = await getDB();

    const inviterMembership = await db
      .select()
      .from(user_organization)
      .where(
        and(
          eq(user_organization.user_id, inviterId),
          eq(user_organization.organization_id, orgId)
        )
      )
      .limit(1);

    if (inviterMembership.length === 0) {
      throw new InvitationFailedError("Inviter is not a member of this organization");
    }

    try {
      await db.insert(user_invitation).values({
        id: this.genId(),
        inviter_id: inviterId,
        invitee_email: inviteeEmail,
        organization_id: orgId,
        status: "pending",
        created_at: new Date(),
      });
      await this.sendInvitationEmail(inviteeEmail, orgId);

      return true;
    } catch (err) {
      console.error("Failed to invite user:", err);
      throw new InvitationFailedError();
    }
  },

  async sendInvitationEmail(email: string, orgId: string) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not set, skipping email send.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const invitationLink = `${process.env.APP_BASE_URL}/accept-invite?org=${orgId}&email=${encodeURIComponent(
      email
    )}`;

    await transporter.sendMail({
      from: `"Org Invites" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "You have been invited to join an organization",
      text: `You have been invited to join an organization. Click here to accept: ${invitationLink}`,
      html: `<p>You have been invited to join an organization.</p><p><a href="${invitationLink}">Click here to accept</a></p>`,
    });
  },
};
