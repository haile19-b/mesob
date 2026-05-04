import jwt from "jsonwebtoken";
import { env } from "../env";

export const TokenUtil = {
  generateToken(payload: { id: string; roles: string[] }) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
  },

  verifyToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
};
