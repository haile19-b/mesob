import { Request, Response, NextFunction } from "express";
import { TokenUtil } from "../utils/token";
import { prisma } from "../lib/prisma";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Missing token" });

    const token = header.split(" ")[1];
    try {
        const decoded: any = TokenUtil.verifyToken(token);
        
        // Fetch fresh roles from DB to prevent stale JWT access issues
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        (req as any).user = { ...decoded, roles: user.roles };
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !user.roles) {
            return res.status(403).json({ message: "Access denied." });
        }

        const hasRole = roles.some(role => user.roles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(', ')}` });
        }
        next();
    };
}
