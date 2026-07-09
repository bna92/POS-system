import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  role: string;
  name: string;
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "8h",
  });
}
