import { BaseRepository } from './base.repository.js';
import { jest } from '@jest/globals';

describe('BaseRepository', () => {
  it('delegates create and update operations to its injected model', async () => {
    const model = {
      create: jest.fn().mockResolvedValue({ id: 'user-1' }),
      findByIdAndUpdate: jest.fn().mockResolvedValue({ id: 'user-1', isDeleted: true })
    };
    const repository = new BaseRepository(model);

    await expect(repository.create({ email: 'ada@example.com' })).resolves.toEqual({
      id: 'user-1'
    });
    await expect(repository.softDeleteById('user-1')).resolves.toMatchObject({ isDeleted: true });
    expect(model.create).toHaveBeenCalledWith({ email: 'ada@example.com' }, undefined);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ isDeleted: true, deletedAt: expect.any(Date) }),
      { new: true, runValidators: true }
    );
  });
});
