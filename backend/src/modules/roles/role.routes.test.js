import { jest } from '@jest/globals';
import { createRoleController } from './role.controller.js';

describe('role routes', () => {
  it('accepts permission assignment for a role', async () => {
    const req = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { permissions: ['manage:users'] },
      auth: { sub: 'user-1' }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    const next = jest.fn();

    const service = {
      addPermissionsToRole: jest.fn().mockResolvedValue({ role: { id: 'role-1' } })
    };

    const controller = createRoleController(service);

    await controller.assignPermissions(req, res, next);

    expect(service.addPermissionsToRole).toHaveBeenCalledWith('507f1f77bcf86cd799439011', ['manage:users'], 'user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Object) }));
  });
});
