const Settings = require("../models/settingsModel");

const DEFAULT_SETTINGS = {
  key: "restaurant",
  restaurantName: "AURA Luxury Dining",
  category: "Nhà hàng Cao cấp / Quốc tế",
  address: "123 Luxury Avenue, District 1, Ho Chi Minh City",
  description:
    "Trải nghiệm ẩm thực độc quyền kết hợp nghệ thuật ẩm thực hiện đại với sự thanh lịch cổ điển.",
  phone: "+84 28 3822 0000",
  email: "reservations@aura-dining.com",
  weekdayHours: "17:00 - 23:00",
  weekendHours: "11:00 - 23:30",
  maxAdvanceBookingDays: 30,
  cancelBeforeHours: 24,
  depositPercent: 30,
};

const editableFields = [
  "restaurantName",
  "category",
  "address",
  "description",
  "phone",
  "email",
  "weekdayHours",
  "weekendHours",
  "maxAdvanceBookingDays",
  "cancelBeforeHours",
  "depositPercent",
];

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: "restaurant" });

  if (!settings) {
    settings = await Settings.create(DEFAULT_SETTINGS);
  }

  return settings;
};

const buildPayload = (body) => {
  const payload = {};

  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  });

  ["maxAdvanceBookingDays", "cancelBeforeHours", "depositPercent"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      payload[field] = Number(payload[field]);
    }
  });

  return payload;
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: "restaurant" },
      { ...DEFAULT_SETTINGS, ...buildPayload(req.body), key: "restaurant" },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
