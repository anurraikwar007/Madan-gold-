export default class BaseService {

  constructor(repository) {

    if (!repository) {
      throw new Error(
        "Repository is required."
      );
    }

    this.repository = repository;

  }

  // =====================================================
  // Create
  // =====================================================

  async create(payload) {

    return this.repository.create(
      payload
    );

  }

  // =====================================================
  // Find By Id
  // =====================================================

  async findById(id) {

    const document =
      await this.repository.findById(id);

    if (!document) {
      throw new Error(
        "Resource not found."
      );
    }

    return document;

  }

  // =====================================================
  // Find One
  // =====================================================

  async findOne(filter) {

    return this.repository.findOne(
      filter
    );

  }

  // =====================================================
  // Exists
  // =====================================================

  async exists(filter) {

    return this.repository.exists(
      filter
    );

  }

  // =====================================================
  // Update
  // =====================================================

  async update(id, payload) {

    const updated =
      await this.repository.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: payload,
        },
        {
          returnDocument: "after",
        }
      );

    if (!updated) {
      throw new Error(
        "Resource not found."
      );
    }

    return updated;

  }

  // =====================================================
  // Delete
  // =====================================================

  async delete(id) {

    const deleted =
   await this.repository.deleteOne({
    _id: id,
   });

    if (
      !deleted ||
      deleted.deletedCount === 0
    ) {
      throw new Error(
        "Resource not found."
      );
    }

  return true;
  }

  // =====================================================
  // Pagination
  // =====================================================

  async paginate(options) {

    return this.repository.paginate(
      options
    );

  }

}