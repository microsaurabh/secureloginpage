import { DEFAULT_ROLES, seedDefaultRoles } from './default-roles.service.js';
import { jest } from '@jest/globals';

describe('seedDefaultRoles', () => {
  it('upserts each immutable default role', async () => {
    const roleModel = { updateOne: jest.fn().mockResolvedValue({ acknowledged: true }) };

    await expect(seedDefaultRoles(roleModel)).resolves.toBe(DEFAULT_ROLES.length);
    expect(roleModel.updateOne).toHaveBeenCalledTimes(DEFAULT_ROLES.length);
    expect(roleModel.updateOne).toHaveBeenCalledWith(
      { name: 'SUPER_ADMIN' },
      expect.objectContaining({ $setOnInsert: expect.objectContaining({ isSystem: true }) }),
      { upsert: true, runValidators: true }
    );
  });
});
