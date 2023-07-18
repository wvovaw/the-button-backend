/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FastifyRequest } from "fastify";
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
) {
  const record = await createRecord({
    ...request.body,
    ownerId: request.user.id,
  });

  return record;
}

export async function updateRecordHandler(
  request: FastifyRequest<{
    Body: UpdateRecordInput;
  }>,
) {
  const record = await updateRecord({
    ...request.body,
    ownerId: request.user.id,
  });

  return record;
}

export async function getRecordByOwnerIdHandler(
  request: FastifyRequest<{
    Params: GetRecordByOwnderIdInput;
  }>,
) {
  try {
    const records = await getRecordByOwnerId({ ...request.params });
    return records;
  } catch (e) {
    console.log(e);
    return null;
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
