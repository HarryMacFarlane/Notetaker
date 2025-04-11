"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var index_1 = require("../Models/index");
var constants_1 = require("./constants");
var jsonwebtoken_1 = require("jsonwebtoken");
exports.AuthController = {
    login: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var data, user, _a, refreshToken, accessToken, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = req.body;
                    user = new index_1.AuthModel(data);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, user.login()];
                case 2:
                    _a = _b.sent(), refreshToken = _a.refreshToken, accessToken = _a.accessToken;
                    res.cookie('refresh_token', refreshToken, constants_1.COOKIE_OPTIONS);
                    res.cookie('access_token', accessToken, constants_1.COOKIE_OPTIONS);
                    res.status(200).json({ message: "Successful login!", access_token: accessToken });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [2 /*return*/, res.status(500).json({ error: "Could not sign in!" })];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    register: function (req, res) {
        var data = req.body;
        var user = new index_1.AuthModel(data);
        try {
            var _a = user.register(), refreshToken = _a.refreshToken, accessToken = _a.accessToken;
            res.cookie('refresh_token', refreshToken, constants_1.COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, constants_1.COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not register!" });
        }
    },
    refresh: function (req, res) {
        var accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
        accessToken !== null && accessToken !== void 0 ? accessToken : (accessToken = req.signedCookies['access_token']);
        if (!accessToken) {
            return res.status(401).json({ error: "Could not validate identity! " });
        }
        var payload = jsonwebtoken_1.default.decode(accessToken, constants_1.JWT_DECODE_OPTIONS);
        if (!payload) {
            return res.status(401).json({ error: "Could not validate identity! " });
        }
        try {
            var user = (0, index_1.findUser)(Number(payload));
            var session = new index_1.SessionModel(user);
            var _a = session.handleSession(), accessToken_1 = _a.accessToken, refreshToken = _a.refreshToken;
            // ADD SOME CODE HERE TO VERIFY WE ARE PROCEEDING EFFECTIVELY!
            res.cookie('refresh_token', refreshToken, constants_1.COOKIE_OPTIONS);
            res.cookie('access_token', accessToken_1, constants_1.COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken_1 });
        }
        catch (error) {
            return res.status(500).json({ error: "Problem on our end. Please log in again!" });
        }
        // Complete this function to verify what type of payload we have (in theory i should ALWAYS be a json with a number...)
    }
};
