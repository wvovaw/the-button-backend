/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateRecordInput,
  GetRecordByOwnderIdInput,
  GetRecordsInput,
  UpdateRecordInput,
} from "./record.schema";
import {
  createRecord,
  getRecordByOwnerId,
  getRecords,
  updateRecord,
} from "./record.service";

export async function createRecordHandler(
  request: FastifyRequest<{
    Body: CreateRecordInput;
  }>,
  reply: FastifyReply,
) {
  try {
    const record = await createRecord({
      ...request.body,
      ownerId: request.user.id,
    });
    return reply.code(201).send(record);
  } catch (e) {
    if (e instanceof Error) {
      if (!isNaN(Number(e.cause)))
        return reply.code(Number(e.cause)).send(e.message);
      else return reply.code(500).send("Unhandled server error");
    } else throw e;
  }
}

export async function updateRecordHandler(
  request: FastifyRequest<{
    Body: UpdateRecordInput;
  }>,
  reply: FastifyReply,
) {
  try {
    const record = await updateRecord({
      ...request.body,
      ownerId: request.user.id,
    });
    if (!record) {
      throw new Error(
        `The user with id ${request.user.id} doesn not have a Record associated with them`,
        {
          cause: "409",
        },
      );
    }
    return record;
  } catch (e) {
    if (e instanceof Error) {
      if (!isNaN(Number(e.cause)))
        return reply.code(Number(e.cause)).send(e.message);
      else return reply.code(500).send("Unhandled server error");
    } else throw e;
  }
}

export async function getRecordByOwnerIdHandler(
  request: FastifyRequest<{
    Params: GetRecordByOwnderIdInput;
  }>,
  reply: FastifyReply,
) {
  try {
    const records = await getRecordByOwnerId({ ...request.params });
    return reply.code(200).send(records);
  } catch (e) {
    if (e instanceof Error) {
      if (!isNaN(Number(e.cause))) {
        return reply.code(Number(e.cause)).send(e.message);
      } else return reply.code(500).send("Unhandled server error");
    } else throw e;
  }
}

export async function getRecordsHandler(
  request: FastifyRequest<{
    Querystring: GetRecordsInput;
  }>,
) {
  const records = await getRecords({
    ...request.query,
  });

  return records;
}
