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
        highscore: data.highscore,
        totalClicks: data.totalClicks,
        average: data.average,
        totalResets: data.resets,
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
    const currentAverage = await prisma.record.findUnique({
      where: {
        ownerId: data.ownerId,
      },
      select: {
        average: true,
        totalResets: true,
      },
    });

    const { average, totalResets } = currentAverage ?? {
      average: 0,
      totalResets: 0,
    };
    const newAverage =
      (average * totalResets + data.average * data.resets) / totalResets +
      data.resets;

    return await prisma.record.update({
      where: {
        ownerId: data.ownerId,
      },
      data: {
        highscore: data.highscore,
        totalClicks: { increment: data.totalClicks },
        totalResets: { increment: data.resets },
        average: newAverage,
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
        highscore: true,
        totalClicks: true,
        totalResets: true,
        average: true,
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
      orderBy: [{ highscore: "desc" }, { totalResets: "asc" }],
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
