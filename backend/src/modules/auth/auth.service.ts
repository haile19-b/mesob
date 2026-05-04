import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { TokenUtil } from "../../utils/token";

export const AuthService = {
  async register(data: any) {
    const existingUser = await prisma.user.findUnique({
      where: { phone: data.phone }
    });

    if (existingUser) {
      throw new Error("User with this phone number already exists.");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        passwordHash,
      }
    });

    const token = TokenUtil.generateToken({ id: user.id, roles: user.roles });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword
    };
  },

  async login(data: any) {
    const user = await prisma.user.findUnique({
      where: { phone: data.phone }
    });

    if (!user) {
      throw new Error("Invalid phone number or password.");
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid phone number or password.");
    }

    const token = TokenUtil.generateToken({ id: user.id, roles: user.roles });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword
    };
  }
};
