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
exports.SessionModel = void 0;
exports.findUser = findUser;
var bcrypt_1 = require("bcrypt");
var node_crypto_1 = require("node:crypto");
var jsonwebtoken_1 = require("jsonwebtoken");
var db_1 = require("../Storage/db");
var constants_1 = require("./constants");
var AuthModel = /** @class */ (function () {
    function AuthModel(data) {
        if (!data) {
            this.email = "NAN";
            this.password = "NAN";
            return;
        }
        this.email = data.email;
        this.password = data.password;
        this.last_sign_in = Date.now();
    }
    AuthModel.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = db_1.default.prepare(constants_1.AUTH_STMTS.LOGIN).get(this);
                        if (!user) {
                            throw new Error("No such user exists for this email!");
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(this.password, user.password_hash)
                                .then(function (result) {
                                if (!result) {
                                    throw new Error("Incorrect password!");
                                }
                                var session = new SessionModel(user);
                                return session.handleSession();
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthModel.prototype.register = function () {
        var passwordHash = bcrypt_1.default.hashSync(this.password, 10);
        var timestamp = Date.now();
        var user = db_1.default.prepare(constants_1.AUTH_STMTS.REGISTER).get(this.email, passwordHash, timestamp, timestamp);
        if (!user) {
            throw new Error("Could not create user, try again later!");
        }
        var newSession = new SessionModel(user);
        return newSession.handleSession();
    };
    return AuthModel;
}());
exports.default = AuthModel;
var SessionModel = /** @class */ (function () {
    function SessionModel(user) {
        this.user = user;
    }
    SessionModel.prototype.handleSession = function () {
        var activeSession = db_1.default.prepare(constants_1.SESSION_STMTS.FIND).get(this.user);
        var accessToken = jsonwebtoken_1.default.sign({ 'id': this.user.id }, process.env.TOKEN_SECRET, constants_1.JWT_SIGN_OPTIONS);
        // Session not expired yet?
        if (activeSession && activeSession.expires_at > Date.now()) {
            db_1.default.prepare(constants_1.SESSION_STMTS.REFRESH).run(accessToken, activeSession.id);
            var refreshToken_1 = activeSession.refresh_token;
            return { refreshToken: refreshToken_1, accessToken: accessToken };
        }
        var refreshToken = node_crypto_1.default.randomBytes(64).toString('utf8');
        var timestamp = Date.now();
        var expiry = timestamp + constants_1.SEVEN_DAYS;
        db_1.default.prepare(constants_1.SESSION_STMTS.CREATE).run(this.user.id, refreshToken, accessToken, timestamp, expiry);
        return { refreshToken: refreshToken, accessToken: accessToken };
    };
    return SessionModel;
}());
exports.SessionModel = SessionModel;
function findUser(id) {
    var user = db_1.default.prepare(constants_1.SESSION_STMTS.FIND).get({ id: id });
    if (!user) {
        throw new Error("Could not retrieve user!");
    }
    return user;
}
