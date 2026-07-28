import { asyncHandler } from '../../utils/async-handler.js';

export class UserController {
  constructor(service) {
    this.service = service;
  }

  getProfile = async (req, res) => {
    const result = await this.service.getUserProfile(req.auth.sub);
    res.status(200).json({ data: result });
  };

  updateProfile = async (req, res) => {
    const result = await this.service.updateProfile(req.auth.sub, req.body);
    res.status(200).json({ data: result });
  };

  listUsers = async (req, res) => {
    const result = await this.service.listUsers(req.body ?? {});
    res.status(200).json({ data: result });
  };

  setStatus = async (req, res) => {
    const result = await this.service.setUserStatus(req.params.userId, req.body.status, req.auth.sub);
    res.status(200).json({ data: result });
  };

  resetPassword = async (req, res) => {
    const result = await this.service.resetPassword(req.params.userId, req.auth.sub);
    res.status(200).json({ data: result });
  };

  deleteUser = async (req, res) => {
    await this.service.deleteUser(req.params.userId, req.auth.sub);
    res.status(204).send();
  };

  getLoginHistory = async (req, res) => {
    const result = await this.service.getLoginHistory(req.params.userId);
    res.status(200).json({ data: result });
  };

  getAuditLogs = async (req, res) => {
    const result = await this.service.getAuditLogs(req.params.userId);
    res.status(200).json({ data: result });
  };
}

export const userController = new UserController();
export const userControllerHandler = asyncHandler(userController.getProfile);
