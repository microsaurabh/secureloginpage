import { RoleService } from './role.service.js';

export function createRoleController(service = new RoleService()) {
  return {
    listRoles: async (req, res, next) => {
      try {
        const result = await service.listRoles(req.query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    getRole: async (req, res, next) => {
      try {
        const result = await service.getRole(req.params.id);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    upsertRole: async (req, res, next) => {
      try {
        const result = await service.upsertRole(req.body, req.auth?.sub);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },

    deleteRole: async (req, res, next) => {
      try {
        await service.deleteRole(req.params.id, req.auth?.sub);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },

    assignPermissions: async (req, res, next) => {
      try {
        const result = await service.addPermissionsToRole(req.params.id, req.body.permissions ?? [], req.auth?.sub);
        res.status(200).json({ data: result });
      } catch (error) {
        next(error);
      }
    }
  };
}

const roleController = createRoleController();

export const listRoles = roleController.listRoles;
export const getRole = roleController.getRole;
export const upsertRole = roleController.upsertRole;
export const deleteRole = roleController.deleteRole;
export const assignPermissions = roleController.assignPermissions;
