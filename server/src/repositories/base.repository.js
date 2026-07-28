class BaseRepository {

  constructor(model) {

    this.model = model;

  }

  // =====================================================
  // Create
  // =====================================================

  async create(data, options = {}) {

    if (options.session) {

      const docs =
        await this.model.create(
          [data],
          {
            session: options.session,
          }
        );

      return docs[0];

    }

    return await this.model.create(data);

  }

  // =====================================================
  // Find One
  // =====================================================

  async findOne(
    filter = {},
    options = {}
  ) {

    let query =
      this.model.findOne(filter);

    if (options.select) {

      query =
        query.select(options.select);

    }

    if (options.populate) {

      query =
        query.populate(options.populate);

    }

    if (options.session) {

      query =
        query.session(options.session);

    }

    if (options.lean !== false) {

      query =
        query.lean();

    }

    return await query;

  }

  // =====================================================
  // Find By Id
  // =====================================================

  async findById(
    id,
    options = {}
  ) {

    let query =
      this.model.findById(id);

    if (options.select) {

      query =
        query.select(options.select);

    }

    if (options.populate) {

      query =
        query.populate(options.populate);

    }

    if (options.session) {

      query =
        query.session(options.session);

    }

    if (options.lean !== false) {

      query =
        query.lean();

    }

    return await query;

  }

  // =====================================================
  // Find
  // =====================================================

  async find(
    filter = {},
    options = {}
  ) {

    let query =
      this.model.find(filter);

    if (options.select) {

      query =
        query.select(options.select);

    }

    if (options.populate) {

      if (
        Array.isArray(
          options.populate
        )
      ) {

        for (const populate of options.populate) {

          query =
            query.populate(populate);

        }

      } else {

        query =
          query.populate(
            options.populate
          );

      }

    }

    if (options.sort) {

      query =
        query.sort(options.sort);

    }

    if (options.skip) {

      query =
        query.skip(options.skip);

    }

    if (options.limit) {

      query =
        query.limit(options.limit);

    }

    if (options.session) {

      query =
        query.session(options.session);

    }

    if (options.lean !== false) {

      query =
        query.lean();

    }

    return await query;

  }

  // =====================================================
  // Find One And Update
  // =====================================================

  async findOneAndUpdate(
    filter,
    update,
    options = {}
  ) {

    return await this.model.findOneAndUpdate(

      filter,

      update,

      {

        new: true,

        runValidators: true,

        ...options,

      }

    );

  }

  // =====================================================
  // Find By Id And Update
  // =====================================================

  async findByIdAndUpdate(
    id,
    update,
    options = {}
  ) {

    return await this.model.findByIdAndUpdate(

      id,

      update,

      {

        new: true,

        runValidators: true,

        ...options,

      }

    );

  }

  // =====================================================
  // Update Many
  // =====================================================

  async updateMany(
    filter,
    update,
    options = {}
  ) {

    return await this.model.updateMany(

      filter,

      update,

      options

    );

  }

  // =====================================================
  // Delete
  // =====================================================

  async deleteOne(
    filter
  ) {

    return await this.model.deleteOne(
      filter
    );

  }

  // =====================================================
  // Count
  // =====================================================

  async count(
    filter = {}
  ) {

    return await this.model.countDocuments(
      filter
    );

  }

  // =====================================================
  // Exists
  // =====================================================

  async exists(
    filter = {}
  ) {

    return await this.model.exists(
      filter
    );

  }

  // =====================================================
  // Aggregate
  // =====================================================

  async aggregate(
    pipeline = []
  ) {

    return await this.model.aggregate(
      pipeline
    );

  }

}

export default BaseRepository;