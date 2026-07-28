export function softDeletePlugin(schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null }
  });

  const queryMethods = [
    'countDocuments',
    'find',
    'findOne',
    'findOneAndUpdate',
    'updateMany',
    'updateOne'
  ];
  queryMethods.forEach((method) => {
    schema.pre(method, function filterDeleted() {
      if (!this.getOptions().withDeleted) this.where({ isDeleted: false });
    });
  });

  schema.query.withDeleted = function withDeleted() {
    return this.setOptions({ withDeleted: true });
  };

  schema.query.onlyDeleted = function onlyDeleted() {
    return this.withDeleted().where({ isDeleted: true });
  };

  schema.methods.softDelete = function softDelete() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function restore() {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };
}
