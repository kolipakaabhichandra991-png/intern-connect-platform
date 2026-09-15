import { z } from 'zod';
import xss from 'xss';

// Sanitize string to remove HTML tags and some special chars
const sanitizeString = (str: string) => {
  if (!str) return str;
  return xss(str).trim();
};

export const LoginSchema = z.object({
  email: z.string().email().max(100).transform(sanitizeString),
  password: z.string().min(6).max(100).transform(sanitizeString),
  role: z.enum(["ADMIN", "INTERN"]).optional(),
  otp: z.string().max(10).optional().transform(val => val ? sanitizeString(val) : val)
});

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100).transform(sanitizeString),
  email: z.string().email().max(100).transform(sanitizeString),
  password: z.string().min(6).max(100).transform(sanitizeString),
  role: z.enum(["ADMIN", "INTERN"]).optional(),
  department: z.string().max(100).optional().transform(val => val ? sanitizeString(val) : val),
  photoUrl: z.string().url().max(500).optional().transform(val => val ? sanitizeString(val) : val)
});
