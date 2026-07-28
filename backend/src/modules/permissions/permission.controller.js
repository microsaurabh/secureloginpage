import { PermissionService } from './permission.service.js';

const service = new PermissionService();

export const listPermissions = async (req, res, next) => {
  try {
    const result = await service.listPermissions(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const upsertPermission = async (req, res, next) => {
  try {
    const result = await service.upsertPermission(req.body, req.auth?.sub);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  try {
    await service.deletePermission(req.params.id, req.auth?.sub);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
