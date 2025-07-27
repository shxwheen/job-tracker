// pages/api/jobs/[id].ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Ensure user is signed in
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  const userId = session.user.id;

  const jobId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!jobId) return res.status(400).json({ error: "Missing job ID" });

  // delete job
  if (req.method === "DELETE") {
    // only delete if the job belongs to the user
    const result = await prisma.job.deleteMany({
      where: { id: jobId, userId },
    });
    if (result.count === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.status(204).end();
  }

  if (req.method === "PATCH") {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Missing status" });

    // 2) Update only if the job belongs to this user
    const result = await prisma.job.updateMany({
      where: { id: jobId, userId },
      data: { status },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // 3) Fetch and return the updated job
    const updated = await prisma.job.findUnique({ where: { id: jobId } });
    return res.status(200).json(updated);
  }

  // If not PATCH
  res.setHeader("Allow", ["PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
