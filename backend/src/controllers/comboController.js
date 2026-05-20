const Combo = require("../models/comboModel");

const editableFields = [
  "name",
  "description",
  "guests",
  "dishes",
  "price",
  "image",
  "status",
  "featured",
];

const normalizeDishes = (dishes) => {
  if (Array.isArray(dishes)) {
    return dishes.map((dish) => String(dish).trim()).filter(Boolean);
  }

  if (typeof dishes === "string") {
    return dishes
      .split(/\r?\n/)
      .map((dish) => dish.trim())
      .filter(Boolean);
  }

  return [];
};

const buildPayload = (body) => {
  const payload = {};

  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(payload, "dishes")) {
    payload.dishes = normalizeDishes(payload.dishes);
  }

  if (Object.prototype.hasOwnProperty.call(payload, "price")) {
    payload.price = Number(payload.price);
  }

  return payload;
};

const getCombos = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status && req.query.status !== "Tất cả") {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const search = new RegExp(req.query.search, "i");
      filter.$or = [
        { name: search },
        { description: search },
        { guests: search },
        { dishes: search },
      ];
    }

    const combos = await Combo.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: combos.length, data: combos });
  } catch (err) {
    next(err);
  }
};

const getComboById = async (req, res, next) => {
  try {
    const combo = await Combo.findById(req.params.id);

    if (!combo) {
      res.status(404);
      return next(new Error("Không tìm thấy combo"));
    }

    res.json({ success: true, data: combo });
  } catch (err) {
    next(err);
  }
};

const createCombo = async (req, res, next) => {
  try {
    const combo = await Combo.create(buildPayload(req.body));
    res.status(201).json({ success: true, data: combo });
  } catch (err) {
    next(err);
  }
};

const updateCombo = async (req, res, next) => {
  try {
    const combo = await Combo.findByIdAndUpdate(
      req.params.id,
      buildPayload(req.body),
      { new: true, runValidators: true }
    );

    if (!combo) {
      res.status(404);
      return next(new Error("Không tìm thấy combo"));
    }

    res.json({ success: true, data: combo });
  } catch (err) {
    next(err);
  }
};

const updateComboStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const combo = await Combo.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!combo) {
      res.status(404);
      return next(new Error("Không tìm thấy combo"));
    }

    res.json({ success: true, data: combo });
  } catch (err) {
    next(err);
  }
};

const deleteCombo = async (req, res, next) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);

    if (!combo) {
      res.status(404);
      return next(new Error("Không tìm thấy combo"));
    }

    res.json({ success: true, message: "Đã xóa combo thành công" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCombos,
  getComboById,
  createCombo,
  updateCombo,
  updateComboStatus,
  deleteCombo,
};
