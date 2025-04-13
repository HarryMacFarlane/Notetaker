"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_DECODE_OPTIONS = exports.COOKIE_OPTIONS = void 0;
exports.COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000, signed: true };
exports.JWT_DECODE_OPTIONS = { complete: true, };
//# sourceMappingURL=constants.js.map