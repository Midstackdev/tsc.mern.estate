import { roles } from "./Role";

export default class Permissions {
  constructor(public permissions: []) {
    this.permissions = [];
  }

  static getPermissionsByRoleName(roleName: string) {
    const role = roles.find((r) => r.name === roleName);
    return role ? role.permissions : [];
  }
}
