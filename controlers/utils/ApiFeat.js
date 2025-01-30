/*eslint-disable*/

class APIFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    filter() {
      const queryObj = { ...this.queryStr };
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((el) => delete queryObj[el]); //doubt
      //Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      // let query = Tour.find(JSON.parse(queryStr))    //returns a query obj
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
    sort() {
      if (this.queryStr.sort) {
        const sortBY = this.queryStr.sort.split(',').join(' ');
        this.query = this.query.sort(sortBY);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
    // Filed limiting
  
    limitFields() {
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports = APIFeatures;