// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware function to validate JWT token
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  jwt.verify(token, `${process.env.SECERET_KEY}`, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Attach the decoded user request object for future use
    req.user = decoded;
    next();
  });
}
