import { User } from "@prisma/client";
import { prismaDB } from "../lib/db";
import { authSigninDtoWithZodType } from "../schema/auth";

class AuthService {
  async signup(body: authSigninDtoWithZodType) {
    const user = await prismaDB.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    return Response.json(user, { status: 201 });
  }

  async getUsers() {
    return await prismaDB.user.findMany();
  }
}

export default AuthService;
