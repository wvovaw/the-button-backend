/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Prisma } from "@prisma/client";
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
  try {
    return await prisma.record.create({
      data: {
        highScore: data.score,
        totalAttempts: 1,
        updatedTimes: 0,
        ownerId: data.ownerId,
      },
      include: {
        owner: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002")
        throw new Error(
          `The user with id ${data.ownerId} already has a Record associated with it`,
          {
            cause: "409",
          },
        );
    } else throw e;
  }
}

export async function updateRecord(
  data: UpdateRecordInput & { ownerId: number },
) {
  try {
    return await prisma.record.update({
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002")
        throw new Error(
          `The user with id ${data.ownerId} doesn not have a Record associated with them`,
          {
            cause: "409",
          },
        );
    } else throw e;
  }
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
  try {
    return await prisma.record.findUniqueOrThrow({
      where: {
        ownerId: params.ownerId,
      },
      include: {
        owner: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        throw new Error(`Record not found for ownerId ${params.ownerId}`, {
          cause: "404",
        });
    } else throw e;
  }
}
