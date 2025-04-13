"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./Routers/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
app.use('/', index_1.AuthRouter);
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
//# sourceMappingURL=app.js.map