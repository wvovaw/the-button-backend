import { FastifyReply, FastifyRequest } from "fastify";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (e: unknown) {
    console.log(e);
    if (e instanceof Error) return reply.code(Number(e.cause)).send(e);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  // find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send(
      new Error("Invalid email or password", {
        cause: 401,
      }),
    );
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;
    // generate access token
    return { accessToken: request.jwt.sign(rest) };
  }

  return reply.code(401).send(
    new Error("Invalid email or password", {
      cause: 401,
    }),
  );
}

export async function getUsersHandler() {
  const users = await findUsers();

  return users;
}
