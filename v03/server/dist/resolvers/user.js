"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const entities_1 = require("../entities");
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthInput = class AuthInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AuthInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AuthInput.prototype, "password", void 0);
AuthInput = __decorate([
    (0, type_graphql_1.InputType)()
], AuthInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => entities_1.User, { nullable: true }),
    __metadata("design:type", entities_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let AuthCheckResponse = class AuthCheckResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AuthCheckResponse.prototype, "ok", void 0);
AuthCheckResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], AuthCheckResponse);
let UserResolver = class UserResolver {
    async getUser({ em, req }) {
        if (!req.session.user) {
            return {
                errors: [
                    {
                        field: "NAN",
                        message: "You are not signed in!"
                    }
                ]
            };
        }
        return {
            user: req.session.user
        };
    }
    me({ req }) {
        if (!req.session.user) {
            return { ok: false };
        }
        else {
            return { ok: true };
        }
    }
    async login({ em, req }, options) {
        const user = await em.findOne(entities_1.User, { email: options.email });
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "No account linked with this email"
                    }
                ]
            };
        }
        if (!bcrypt_1.default.compareSync(options.password, user.password)) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password"
                    }
                ]
            };
        }
        req.session.user = user;
        return { user };
    }
    async register({ em, req }, options) {
        const hashedPassword = await bcrypt_1.default.hash(options.password, 10);
        const user = em.create(entities_1.User, {
            email: options.email,
            password: hashedPassword
        });
        try {
            await em.persistAndFlush(user);
        }
        catch (err) {
            console.error(err);
            if (err.code === '23505') {
                return {
                    errors: [{
                            field: "email",
                            message: "There is already an account linked with this name!"
                        }]
                };
            }
        }
        req.session.user = user;
        return { user };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => AuthCheckResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", AuthCheckResponse)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AuthInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AuthInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.default = UserResolver;
//# sourceMappingURL=user.js.map