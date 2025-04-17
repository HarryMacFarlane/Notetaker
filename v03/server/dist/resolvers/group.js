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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const entities_1 = require("../entities");
const membership_1 = require("../entities/membership");
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
let GroupSearchResponse = class GroupSearchResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [entities_1.Group]),
    __metadata("design:type", entities_1.Group)
], GroupSearchResponse.prototype, "groups", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError]),
    __metadata("design:type", Array)
], GroupSearchResponse.prototype, "errors", void 0);
GroupSearchResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], GroupSearchResponse);
let GroupResponse = class GroupResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => entities_1.Group),
    __metadata("design:type", entities_1.Group)
], GroupResponse.prototype, "group", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError]),
    __metadata("design:type", Array)
], GroupResponse.prototype, "errors", void 0);
GroupResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], GroupResponse);
let GroupMembershipResponse = class GroupMembershipResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => entities_1.User),
    __metadata("design:type", entities_1.Membership)
], GroupMembershipResponse.prototype, "membership", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError]),
    __metadata("design:type", Array)
], GroupMembershipResponse.prototype, "errors", void 0);
GroupMembershipResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], GroupMembershipResponse);
let GroupCreateParameters = class GroupCreateParameters {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], GroupCreateParameters.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], GroupCreateParameters.prototype, "description", void 0);
GroupCreateParameters = __decorate([
    (0, type_graphql_1.InputType)()
], GroupCreateParameters);
let MembershipParameters = class MembershipParameters {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MembershipParameters.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MembershipParameters.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => membership_1.UserRole),
    __metadata("design:type", String)
], MembershipParameters.prototype, "role", void 0);
MembershipParameters = __decorate([
    (0, type_graphql_1.InputType)()
], MembershipParameters);
let GroupResolver = class GroupResolver {
    checkAdminPermission(user, group_id) {
        const memberships = user.memberships.filter((x) => x.id == group_id);
        if (memberships.length != 1) {
            return false;
        }
        else if (memberships[0].role != "admin") {
            return false;
        }
        return true;
    }
    async getGroup({ em, req }, group_id) {
        if (!req.session.user) {
            return {
                errors: [
                    {
                        field: "user_id",
                        message: "User is not signed in, or doesn't have credentials!"
                    }
                ]
            };
        }
        const membership = await em.findOne(entities_1.Membership, { group: group_id, member: req.session.user });
        if (!membership) {
            return {
                errors: [
                    {
                        field: "group_id",
                        message: "You are not in this group!"
                    }
                ]
            };
        }
        return {
            group: membership.group
        };
    }
    async searchGroups() {
        throw new Error("Not implemented!");
    }
    async create({ em, req }, options) {
        const newGroup = em.create(entities_1.Group, options);
        try {
            await em.persistAndFlush(newGroup);
        }
        catch (err) {
            console.error(err);
            return {
                errors: [{
                        field: "Nan",
                        message: "Implement this!"
                    }]
            };
        }
        return {
            group: newGroup
        };
    }
    modify({ em, req }) {
        throw new Error("Not implemented!");
    }
    async addMember({ em, req }, options) {
        if (!req.session.user) {
            return {
                errors: [{
                        field: "NAN",
                        message: "User is not using active session!"
                    }]
            };
        }
        if (!this.checkAdminPermission(req.session.user, options.id)) {
            return {
                errors: [{
                        field: "User",
                        message: "You do not have the permission to do this!"
                    }]
            };
        }
        if (!options.role) {
            return {
                errors: [{
                        field: "role",
                        message: "Please provide a role for this user!"
                    }]
            };
        }
        const newUser = await em.findOne(entities_1.User, { email: options.email });
        if (!newUser) {
            return {
                errors: [{
                        field: "email",
                        message: "No user found by that email!"
                    }]
            };
        }
        const group = await em.findOne(entities_1.Group, { id: options.id });
        if (!group) {
            return {
                errors: [{
                        field: "id",
                        message: "No group exists with this id!"
                    }]
            };
        }
        const membership = em.create(entities_1.Membership, { group: group, member: newUser, role: options.role });
        try {
            await em.persistAndFlush(membership);
        }
        catch (err) {
            console.error(err);
            return {
                errors: [{
                        field: "NAN",
                        message: "UPDATE THIS GOING FORWARD!!!!!"
                    }]
            };
        }
        newUser?.memberships.add(membership);
        return {
            membership
        };
    }
    async removeMember({ em, req }, options) {
        if (!req.session.user) {
            return false;
        }
        if (!this.checkAdminPermission(req.session.user, options.id)) {
            return false;
        }
        const group = await em.findOne(entities_1.Group, { id: options.id });
        if (!group) {
            console.log("Group Resolver error in removeMember", "No group corresponds to this id!", `id: ${options.id}`);
            return false;
        }
        const user = await em.findOne(entities_1.User, { email: options.email });
        if (!user) {
            console.log("Group Resolver error in removeMember", "No user corresponds to this email!", `email: ${options.email}`);
            return false;
        }
        const intersection = new Set([...user.memberships].filter(x => group.memberships.contains(x)));
        if (intersection.size < 1) {
            return false;
        }
        const membership = intersection.values().next().value;
        try {
            await em.removeAndFlush(membership);
        }
        catch (err) {
            console.error(err);
            return false;
        }
        user.memberships.remove(membership);
        group.memberships.remove(membership);
        return true;
    }
    async leave({ em, req }, options) {
        if (!req.session.user) {
            return false;
        }
        const memberships = req.session.user.memberships.filter((x) => x.group.id == options.id);
        if (memberships.length != 1) {
            return false;
        }
        const membership = memberships[0];
        try {
            await em.removeAndFlush(membership);
        }
        catch (err) {
            console.error(err);
            return false;
        }
        req.session.user.memberships.remove(membership);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => GroupResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GroupResolver.prototype, "getGroup", null);
__decorate([
    (0, type_graphql_1.Query)(() => GroupSearchResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroupResolver.prototype, "searchGroups", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GroupResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GroupCreateParameters]),
    __metadata("design:returntype", Promise)
], GroupResolver.prototype, "create", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GroupResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", GroupResponse)
], GroupResolver.prototype, "modify", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GroupMembershipResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, MembershipParameters]),
    __metadata("design:returntype", Promise)
], GroupResolver.prototype, "addMember", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, MembershipParameters]),
    __metadata("design:returntype", Promise)
], GroupResolver.prototype, "removeMember", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, MembershipParameters]),
    __metadata("design:returntype", Promise)
], GroupResolver.prototype, "leave", null);
GroupResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GroupResolver);
exports.default = GroupResolver;
//# sourceMappingURL=group.js.map