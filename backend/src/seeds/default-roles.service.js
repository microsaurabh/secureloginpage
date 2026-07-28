export const DEFAULT_ROLES = [
  {
    name: 'SUPER_ADMIN',
    description: 'Unrestricted platform administration access.',
    isSystem: true
  },
  {
    name: 'ADMIN',
    description: 'Administrative access to managed platform resources.',
    isSystem: true
  },
  {
    name: 'AUDITOR',
    description: 'Read-only access to audit and security records.',
    isSystem: true
  },
  { name: 'USER', description: 'Standard authenticated platform access.', isSystem: true }
];

export async function seedDefaultRoles(roleModel) {
  const operations = DEFAULT_ROLES.map((role) =>
    roleModel.updateOne(
      { name: role.name },
      { $setOnInsert: { ...role, permissions: [] } },
      { upsert: true, runValidators: true }
    )
  );

  await Promise.all(operations);
  return DEFAULT_ROLES.length;
}
