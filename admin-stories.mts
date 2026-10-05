import type { Config } from "@netlify/functions";
import { timingSafeEqual } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { stories } from "../../db/schema.js";

function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  const given = req.headers.get("x-admin-password");
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async (req: Request) => {
  if (!process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }
  if (!isAuthorized(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  if (req.method === "GET") {
    const rows = await db.select().from(stories).orderBy(desc(stories.createdAt));
    return Response.json(rows, { headers: { "Cache-Control": "no-store" } });
  }

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "invalid_id" }, { status: 400 });
  }

  if (req.method === "PATCH") {
    const { approved } = await req.json().catch(() => ({}));
    await db
      .update(stories)
      .set({ approved: !!approved, approvedAt: approved ? new Date() : null })
      .where(eq(stories.id, id));
    return Response.json({ ok: true });
  }

  if (req.method === "DELETE") {
    await db.delete(stories).where(eq(stories.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/admin/stories",
};
