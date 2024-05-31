import { Elysia, t } from "elysia";
import { z } from "zod";
import { User } from "@prisma/client";

// with zod
export const UserSchemaWithZod = z.object({
  id: z.string().min(1, { message: "required" }),
  email: z
    .string()
    .min(1, { message: "required" })
    .email({ message: "invalid email" }),
  firstname: z.string().min(1, { message: "required" }),
  lastname: z.string().min(1, { message: "required" }),
  password: z.string().min(1, { message: "required" }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}) satisfies z.ZodType<User>;

export const authSigninDtoWithZod = UserSchemaWithZod.pick({
  password: true,
  email: true,
});

export type authSigninDtoWithZodType = z.infer<typeof authSigninDtoWithZod>;

// t with elysia
export const UserSchema = t.Object({
  email: t.String({
    minLength: 1,
    error: "Required",
  }),
  password: t.String({
    minLength: 1,
    error: "Required",
  }),
  firstname: t.String({
    minLength: 1,
    error: "Required",
  }),
  lastname: t.String({
    minLength: 1,
    error: "Required",
  }),
  createdAt: t.Date({}),
  updatedAt: t.Date(),
});

export const authSigninDto = t.Object({
  email: t.String({
    minLength: 1,
  }),
  password: t.String({
    minLength: 1,
  }),
});

export type TypeAuthSigninDto = typeof authSigninDto.properties;
