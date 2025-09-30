class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery; // Mongoose query object
    this.queryStr = queryStr; // Express req.query object
  }

  // 1) Filter by fields and advanced queries
  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filter = JSON.parse(queryStr);

    // Add keyword search if present
    if (this.queryStr.keyword) {
      filter.$or = [
        { title: { $regex: this.queryStr.keyword, $options: "i" } },
        { description: { $regex: this.queryStr.keyword, $options: "i" } },
      ];
    }

    // Only apply filter if it has keys
    if (Object.keys(filter).length > 0) {
      this.mongooseQuery = this.mongooseQuery.find(filter);
    }

    return this; // allow chaining
  }

  search(modelName) {
    if (this.queryStr.keyword) {
      let query = {};
      if (modelName === "Product") {
        query = {
          $or: [
            { title: { $regex: this.queryStr.keyword, $options: "i" } },
            { description: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        };
      } else {
        query = {
          $or: [
            { name: { $regex: this.queryStr.keyword, $options: "i" } },
            { description: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  // 2) Sorting
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  // 3) Field limiting (projection)
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  // 4) Pagination
  paginate(countDocuments) {
    const page = +this.queryStr.page || 1; // Default page 1
    const limit = +this.queryStr.limit || 10; // Default 10 items per page
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const total = countDocuments;
    // Build pagination result
    const pagination = {
      total,
      numberOfPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      hasNext: endIndex < total,
      next: endIndex < total ? page + 1 : null,
      hasPrev: skip > 0,
      prev: skip > 0 ? page - 1 : null,
    };

    // Apply pagination to the query
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    // Store pagination info
    this.paginationResult = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
