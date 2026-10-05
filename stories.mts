import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { stories } from "../../db/schema.js";

const ROLES = ["patiënt", "arts", "behandelaar", "naaste", "anders"];

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db
      .select({
        id: stories.id,
        name: stories.name,
        role: stories.role,
        story: stories.story,
        approvedAt: stories.approvedAt,
      })
      .from(stories)
      .where(eq(stories.approved, true))
      .orderBy(desc(stories.approvedAt));
    return Response.json(rows, { headers: { "Cache-Control": "no-store" } });
  }

  if (req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "invalid_json" }, { status: 400 });
    }

    // Honeypot: echte bezoekers zien dit veld niet
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return Response.json({ ok: true }, { status: 201 });
    }

    const name = String(body.name ?? "").trim();
    const role = String(body.role ?? "").trim();
    const story = String(body.story ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!name || !story) {
      return Response.json({ error: "missing_fields" }, { status: 400 });
    }
    if (name.length > 100 || story.length > 5000 || email.length > 200) {
      return Response.json({ error: "too_long" }, { status: 400 });
    }

    await db.insert(stories).values({
      name,
      role: ROLES.includes(role) ? role : "anders",
      story,
      email: email || null,
    });
    return Response.json({ ok: true }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/stories",
};
