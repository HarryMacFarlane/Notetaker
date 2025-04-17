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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const core_1 = require("@mikro-orm/core");
const uuid_1 = require("uuid");
const type_graphql_1 = require("type-graphql");
const group_1 = __importDefault(require("./group"));
const user_1 = __importDefault(require("./user"));
let Membership = class Membership {
    constructor() {
        this.id = (0, uuid_1.v4)();
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Membership.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => group_1.default),
    (0, core_1.ManyToOne)(() => group_1.default),
    __metadata("design:type", group_1.default)
], Membership.prototype, "group", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_1.default),
    (0, core_1.ManyToOne)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Membership.prototype, "member", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Enum)(() => UserRole),
    __metadata("design:type", String)
], Membership.prototype, "role", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ onCreate: () => new Date, type: "date", default: 'NOW()' }),
    __metadata("design:type", Date)
], Membership.prototype, "joined_at", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ onCreate: () => new Date, onUpdate: () => new Date, type: "date", default: 'NOW()' }),
    __metadata("design:type", Date)
], Membership.prototype, "last_action", void 0);
Membership = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Membership);
exports.default = Membership;
var UserRole;
(function (UserRole) {
    UserRole["READER"] = "reader";
    UserRole["EDITOR"] = "editor";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=membership.js.map