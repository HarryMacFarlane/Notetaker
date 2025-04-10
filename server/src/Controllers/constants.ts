import { CookieOptions } from "express";

export const COOKIE_OPTIONS : CookieOptions = { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, signed: true };