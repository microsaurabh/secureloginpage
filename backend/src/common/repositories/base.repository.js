export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data, options) {
    return this.model.create(data, options);
  }

  findById(id, projection) {
    return this.model.findById(id, projection);
  }

  findOne(filter, projection) {
    return this.model.findOne(filter, projection);
  }

  find(filter = {}, options = {}) {
    return this.model.find(filter, null, options);
  }

  updateById(id, update, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  async softDeleteById(id) {
    return this.model.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true, runValidators: true }
    );
  }
}
