// src/pages/api/jobs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = session.user.id;

  if (req.method === 'GET') {
    const jobs = await prisma.job.findMany({ where: { userId } });
    res.status(200).json(jobs);
  } else if (req.method === 'POST') {
    const { company, position, status } = req.body;
    if (!company || !position || !status) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const newJob = await prisma.job.create({
      data: { company, position, status, userId },
    });
    res.status(201).json(newJob);
  } else {
    res.setHeader('Allow', ['GET','POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
