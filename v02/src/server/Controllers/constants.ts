import { CookieOptions } from "express";
import { DecodeOptions } from "jsonwebtoken";
export const COOKIE_OPTIONS : CookieOptions = { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, signed: true } as const;
export const JWT_DECODE_OPTIONS : DecodeOptions = { complete: true, } as const;