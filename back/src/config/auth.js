import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const secretKey = process.env.JWT_SECRET || "Senha";
export const saltRounds = 10;

export { 
    jwt, 
    bcrypt 
};