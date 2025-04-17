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
const core_1 = require("@mikro-orm/core");
const uuid_1 = require("uuid");
const type_graphql_1 = require("type-graphql");
const membership_1 = __importDefault(require("./membership"));
let Group = class Group {
    constructor() {
        this.id = (0, uuid_1.v4)();
        this.memberships = new core_1.Collection(this);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Group.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "character varying", length: 255 }),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: "character varying", length: 1000 }),
    __metadata("design:type", String)
], Group.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ onCreate: () => new Date, type: "date", default: 'NOW()' }),
    __metadata("design:type", Date)
], Group.prototype, "created_at", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [membership_1.default]),
    (0, core_1.OneToMany)({ mappedBy: 'group', entity: () => membership_1.default }),
    __metadata("design:type", Object)
], Group.prototype, "memberships", void 0);
Group = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Group);
exports.default = Group;
//# sourceMappingURL=group.js.map