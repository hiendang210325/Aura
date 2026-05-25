/**
 * BaseController — Class cha chứa logic CRUD chung.
 *
 * Các class con chỉ cần kế thừa và override những method có logic riêng.
 * Sử dụng 4 nguyên lý OOP:
 *   - Encapsulation (Đóng gói): model, entityName, editableFields được đóng gói trong instance
 *   - Inheritance (Kế thừa): class con extends BaseController để tái sử dụng CRUD
 *   - Polymorphism (Đa hình): class con override buildPayload / buildFilter / create / delete khi cần
 *   - Abstraction (Trừu tượng): class con chỉ cần truyền config, không cần biết chi tiết CRUD bên trong
 */
class BaseController {
  /**
   * @param {import('../repositories/BaseRepository')} repository - Repository instance
   * @param {string}                   entityName  - Tên hiển thị khi báo lỗi (VD: "combo", "món ăn")
   * @param {object}                   [options]   - Cấu hình tùy chọn
   * @param {string[]}  [options.editableFields]   - Danh sách field được phép chỉnh sửa
   * @param {string[]}  [options.searchFields]     - Danh sách field được search bằng regex
   * @param {object}    [options.defaultSort]       - Thứ tự sắp xếp mặc định
   */
  constructor(repository, entityName, options = {}) {
    this.repository = repository;
    this.entityName = entityName;
    this.editableFields = options.editableFields || [];
    this.searchFields = options.searchFields || [];
    this.defaultSort = options.defaultSort || { createdAt: -1 };

    // Bind tất cả method để khi truyền vào router, `this` vẫn trỏ đúng instance
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.delete = this.delete.bind(this);
  }

  // ---------------------------------------------------------------------------
  // PROTECTED HELPERS — Class con có thể override
  // ---------------------------------------------------------------------------

  /**
   * Lọc req.body chỉ giữ lại các field nằm trong editableFields.
   * Nếu không có editableFields, trả nguyên body.
   */
  buildPayload(body) {
    if (this.editableFields.length === 0) return { ...body };

    const payload = {};
    this.editableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        payload[field] = body[field];
      }
    });
    return payload;
  }

  /**
   * Xây dựng filter object từ req.query.
   * Mặc định xử lý: status (bỏ qua "Tất cả") và search (regex trên searchFields).
   */
  buildFilter(query) {
    const filter = {};

    if (query.status && query.status !== "Tất cả") {
      filter.status = query.status;
    }

    if (query.search && this.searchFields.length > 0) {
      const search = new RegExp(query.search, "i");
      filter.$or = this.searchFields.map((field) => ({ [field]: search }));
    }

    return filter;
  }

  // ---------------------------------------------------------------------------
  // PUBLIC CRUD METHODS
  // ---------------------------------------------------------------------------

  /** GET / — Lấy danh sách tất cả */
  async getAll(req, res, next) {
    try {
      const filter = this.buildFilter(req.query);
      const docs = await this.repository.findAll(filter, this.defaultSort);
      res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
      next(err);
    }
  }

  /** GET /:id — Lấy chi tiết theo ID */
  async getById(req, res, next) {
    try {
      const doc = await this.repository.findById(req.params.id);

      if (!doc) {
        res.status(404);
        return next(new Error(`Không tìm thấy ${this.entityName}`));
      }

      res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  }

  /** POST / — Tạo mới */
  async create(req, res, next) {
    try {
      const payload = this.buildPayload(req.body);
      const doc = await this.repository.create(payload);
      res.status(201).json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  }

  /** PUT /:id — Cập nhật toàn bộ */
  async update(req, res, next) {
    try {
      const payload = this.buildPayload(req.body);
      const doc = await this.repository.updateById(req.params.id, payload);

      if (!doc) {
        res.status(404);
        return next(new Error(`Không tìm thấy ${this.entityName}`));
      }

      res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /:id/status — Cập nhật nhanh trạng thái */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const doc = await this.repository.updateById(req.params.id, { status });

      if (!doc) {
        res.status(404);
        return next(new Error(`Không tìm thấy ${this.entityName}`));
      }

      res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  }

  /** DELETE /:id — Xóa */
  async delete(req, res, next) {
    try {
      const doc = await this.repository.deleteById(req.params.id);

      if (!doc) {
        res.status(404);
        return next(new Error(`Không tìm thấy ${this.entityName}`));
      }

      res.json({ success: true, message: `Đã xóa ${this.entityName} thành công` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BaseController;
