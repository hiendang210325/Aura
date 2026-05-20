const Promotion = require("../models/promotionModel");

const editableFields = [
  "title",
  "description",
  "highlight",
  "condition",
  "validUntil",
  "status",
  "featured",
  "displayOrder",
];

const buildPayload = (body) => {
  const payload = {};

  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(payload, "displayOrder")) {
    payload.displayOrder = Number(payload.displayOrder) || 0;
  }

  return payload;
};

const getPromotions = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status && req.query.status !== "Tất cả") {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const search = new RegExp(req.query.search, "i");
      filter.$or = [
        { title: search },
        { description: search },
        { highlight: search },
        { condition: search },
      ];
    }

    const promotions = await Promotion.find(filter).sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    });

    res.json({ success: true, count: promotions.length, data: promotions });
  } catch (err) {
    next(err);
  }
};

const getPublicPromotions = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const limit = Math.min(Number(req.query.limit) || 3, 12);

    const promotions = await Promotion.find({
      status: "Đang áp dụng",
      $or: [{ validUntil: "" }, { validUntil: { $gte: today } }],
    })
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 })
      .limit(limit);

    res.json({ success: true, count: promotions.length, data: promotions });
  } catch (err) {
    next(err);
  }
};

const getPromotionById = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      res.status(404);
      return next(new Error("Không tìm thấy khuyến mãi"));
    }

    res.json({ success: true, data: promotion });
  } catch (err) {
    next(err);
  }
};

const createPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.create(buildPayload(req.body));
    res.status(201).json({ success: true, data: promotion });
  } catch (err) {
    next(err);
  }
};

const updatePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      buildPayload(req.body),
      { new: true, runValidators: true }
    );

    if (!promotion) {
      res.status(404);
      return next(new Error("Không tìm thấy khuyến mãi"));
    }

    res.json({ success: true, data: promotion });
  } catch (err) {
    next(err);
  }
};

const updatePromotionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!promotion) {
      res.status(404);
      return next(new Error("Không tìm thấy khuyến mãi"));
    }

    res.json({ success: true, data: promotion });
  } catch (err) {
    next(err);
  }
};

const deletePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      res.status(404);
      return next(new Error("Không tìm thấy khuyến mãi"));
    }

    res.json({ success: true, message: "Đã xóa khuyến mãi thành công" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPromotions,
  getPublicPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  updatePromotionStatus,
  deletePromotion,
};
