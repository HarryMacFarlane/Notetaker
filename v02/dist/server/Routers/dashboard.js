"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const DashRouter = express_1.default.Router();
DashRouter.use(auth_1.authenticateUser);
DashRouter.get("/", (req, res) => {
    res.sendFile("/client/dist/index.js", { root: "./dist" });
});
exports.default = DashRouter;
//# sourceMappingURL=dashboard.js.map