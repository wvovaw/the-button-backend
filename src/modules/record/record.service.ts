/* eslint-disable @typescript-eslint/no-unsafe-return */
import prisma from "../../utils/prisma";
import {
  CreateRecordInput,
  GetRecordByOwnderIdInput,
  GetRecordsInput,
  UpdateRecordInput,
} from "./record.schema";

export async function createRecord(
  data: CreateRecordInput & { ownerId: number },
) {
  return prisma.record.create({
    data: {
      highScore: data.score,
      totalAttempts: 1,
      updatedTimes: 0,
      ownerId: data.ownerId,
    },
  });
}

export async function updateRecord(
  data: UpdateRecordInput & { ownerId: number },
) {
  return prisma.record.update({
    where: {
      ownerId: data.ownerId,
    },
    data: {
      highScore: data.newScore,
      totalAttempts: {
        increment: data.attempts,
      },
      updatedTimes: {
        increment: 1,
      },
    },
    include: {
      owner: true,
    },
  });
}

export async function getRecords(data: GetRecordsInput) {
  const page = data.page ?? 0;
  const perPage = data.perPage ?? 25;
  const offset = page * perPage;

  const [items, itemsCount] = await prisma.$transaction([
    prisma.record.findMany({
      take: perPage,
      skip: offset,
      select: {
        id: true,
        highScore: true,
        totalAttempts: true,
        updatedTimes: true,
        owner: {
          select: {
            name: true,
            id: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.record.count(),
  ]);

  return {
    data: items,
    meta: {
      page,
      perPage,
      itemsCount,
    },
  };
}

export async function getRecordByOwnerId(params: GetRecordByOwnderIdInput) {
  return await prisma.record.findUnique({
    where: {
      ownerId: params.ownerId,
    },
    select: {
      owner: true,
    },
  });
}
