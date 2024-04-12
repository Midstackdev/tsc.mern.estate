import { NextFunction, Request, Response } from "express";
import Permissions from "../../Services/rbac/Permissions";

// Check if the user has the required permission for a route
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user ? req.user.role : "anonymous";
    const userPermissions = Permissions.getPermissionsByRoleName(
      userRole.toLocaleLowerCase()
    );

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: "Access denied" });
    }
    return next();
  };
};

// Check if the user has the required role for a route
export const checkRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (typeof roles === "string") {
      roles = [roles];
      console.log(roles);
    }
    const userRole = req.user ? req.user.role : "anonymous";

    if (!userRole || (roles.length && !roles.includes(userRole))) {
      return res.status(403).json({ error: "Access denied" });
    }
    return next();
  };
};
