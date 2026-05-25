/**
 * BaseRepository — Class xử lý các thao tác tương tác với MongoDB thông qua Mongoose.
 * 
 * Lớp này giúp tách biệt logic truy cập cơ sở dữ liệu khỏi Controller.
 * Nhờ đó, Controller không cần biết nó đang làm việc với Mongoose hay ORM/Database nào khác.
 */
class BaseRepository {
  /**
   * @param {import('mongoose').Model} model - Mongoose Model
   */
  constructor(model) {
    this.model = model;
  }

  /** Lấy nhiều document có hỗ trợ filter và sort */
  async findAll(filter = {}, sort = {}) {
    return await this.model.find(filter).sort(sort);
  }

  /** Lấy nhiều document có hỗ trợ filter, sort, và limit */
  async findAllWithLimit(filter = {}, sort = {}, limit = 0) {
    let query = this.model.find(filter).sort(sort);
    if (limit > 0) {
      query = query.limit(limit);
    }
    return await query;
  }

  /** Lấy 1 document theo ID */
  async findById(id) {
    return await this.model.findById(id);
  }

  /** Lấy 1 document theo filter tùy ý */
  async findOne(filter = {}) {
    return await this.model.findOne(filter);
  }

  /** Tạo mới 1 document */
  async create(data) {
    return await this.model.create(data);
  }

  /** Cập nhật 1 document theo ID, trả về document mới sau khi cập nhật */
  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /** Xóa 1 document theo ID */
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
