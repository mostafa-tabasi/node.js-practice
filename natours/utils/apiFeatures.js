class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // A) Filtering
    // making a copy of the request query
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // remove excluded fields from the query
    excludedFields.forEach((el) => delete queryObj[el]);

    // B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    // we need to add a $ sign before these 4 operators (operators in mongodb format)
    // gte => greater than or equal
    // gt => greater than
    // lte => less than or equal
    // lt => less than
    // we added "\b" to both side so the exact operator word will be considered as a match
    // we added "g" at the end so for every match we add the $ sign, not only the first match

    // an example for a query with duration greater than or equal 5 will be like:
    // 127.0.0.1:3000/api/v1/tours?duration[gte]=5
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // need to replace "," with a blank space " " in the sort query
      // for the cases that we have more than one field for sorting

      // an example will be like:
      // 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage
      // in this example, the result will be sorted first based on price decending,
      // and then ratingsAverage decending
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    // in case user didn't specify any sorting, apply a default sorting based on "createdAt" field
    else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    // Field limiting (when user only wants especific fields in the response)
    if (this.queryString.fields) {
      // an example will be like:
      // 127.0.0.1:3000/api/v1/tours?fields=name,price
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    // in case user didn't spedify any fields, apply a default limiting by not showing the "__v" field
    else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
