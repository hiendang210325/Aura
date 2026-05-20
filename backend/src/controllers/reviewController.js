const Review = require("../models/reviewModel");

const editableFields = ["customer", "phone", "rating", "date", "source", "text", "status", "reply"];

const buildPayload = (body) => {
  const payload = {};

  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(payload, "rating")) {
    payload.rating = Number(payload.rating);
  }

  return payload;
};

const getReviews = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status && req.query.status !== "Tất cả") {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const search = new RegExp(req.query.search, "i");
      filter.$or = [
        { customer: search },
        { phone: search },
        { source: search },
        { text: search },
        { reply: search },
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(buildPayload(req.body));
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, buildPayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!review) {
      res.status(404);
      return next(new Error("Không tìm thấy đánh giá"));
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const updateReviewReply = async (req, res, next) => {
  try {
    const { reply } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reply: reply || "", status: "Đã phản hồi" },
      { new: true, runValidators: true }
    );

    if (!review) {
      res.status(404);
      return next(new Error("Không tìm thấy đánh giá"));
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      res.status(404);
      return next(new Error("Không tìm thấy đánh giá"));
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      res.status(404);
      return next(new Error("Không tìm thấy đánh giá"));
    }

    res.json({ success: true, message: "Đã xóa đánh giá thành công" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  updateReviewReply,
  updateReviewStatus,
  deleteReview,
};
