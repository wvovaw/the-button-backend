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
    type RecordCreateData = Parameters<typeof prisma.record.create>[0]["data"];
    const record: RecordCreateData = {
      ownerId: data.ownerId,
      average: 0,
      averageWeight: 0,
      totalClicks: 0,
      totalResets: 0,
      highscore: 0,
    };
    if (data.highscore) record.highscore = data.highscore;
    if (data.clicks) record.totalClicks = data.clicks;
    if (data.peaks) {
      const weight = data.peaks.length;
      record.average = data.peaks.reduce((acc, cur) => acc + cur) / weight;
      record.averageWeight = weight;
      record.totalResets = weight;
    }

    return await prisma.record.create({
      data: record,
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
            cause: 409,
          },
        );
    } else throw e;
  }
}

export async function updateRecord(
  data: UpdateRecordInput & { ownerId: number },
) {
  try {
    type RecordUpdateData = Parameters<typeof prisma.record.update>[0]["data"];
    const record: RecordUpdateData = {};

    if (data.clicks) record.totalClicks = { increment: data.clicks };
    if (data.highscore) record.highscore = data.highscore;
    if (data.peaks) {
      const currentAverage = await prisma.record.findUnique({
        where: {
          ownerId: data.ownerId,
        },
        select: {
          average: true,
          averageWeight: true,
        },
      });
      const { average, averageWeight } = currentAverage ?? {
        average: 0,
        averageWeight: 0,
      };

      const w1 = averageWeight;
      const X1 = average * averageWeight;

      const X2 = data.peaks.reduce((acc, cur) => acc + cur);
      const w2 = data.peaks.length;

      record.average = (X1 + X2) / (w1 + w2);
      record.averageWeight = w1 + w2;

      record.totalResets = { increment: data.peaks.length };
    }

    return await prisma.record.update({
      where: {
        ownerId: data.ownerId,
      },
      data: record,
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
            cause: 404,
          },
        );
    } else throw e;
  }
}

export async function deleteRecord(ownerId: number) {
  try {
    await prisma.record.delete({
      where: {
        ownerId,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        throw new Error(`Record not found.`, {
          cause: 404,
        });
    }
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
        ownerId: Number(params.ownerId),
      },
      include: {
        owner: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025")
        throw new Error(`Record not found for ownerId ${params.ownerId}`, {
          cause: 404,
        });
    } else throw e;
  }
}
