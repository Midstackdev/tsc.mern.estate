import _roles from "../../config/roles.json";

export const roles = _roles;

type IRole = {
  name: string;
  permissions: string[];
};

export default class Role {
  constructor(public roles: IRole[]) {
    this.roles = roles;
  }

  getRoleByName(name: string) {
    return this.roles.find((role) => role.name === name);
  }

  getRoles() {
    return this.roles;
  }
}
