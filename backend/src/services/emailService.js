const nodemailer = require("nodemailer");

let cachedTransporter = null;
let cachedConfig = null;

const typeLabels = {
  Standard: "Đặt bàn tiêu chuẩn",
  Combo: "Đặt Combo",
  Birthday: "Sinh nhật & Tiệc riêng tư",
  Corporate: "Sự kiện doanh nghiệp",
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatDate = (dateValue) => {
  if (!dateValue) return "Chưa cập nhật";

  const [year, month, day] = String(dateValue).split("-").map(Number);
  if (!year || !month || !day) return dateValue;

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const getMailConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromAddress = process.env.MAIL_FROM_ADDRESS || user;

  if (!host || !fromAddress) return null;

  const config = {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  };

  if (user && pass) {
    config.auth = { user, pass };
  }

  return {
    transport: config,
    from: {
      name: process.env.MAIL_FROM_NAME || "AURA Restaurant",
      address: fromAddress,
    },
    replyTo: process.env.MAIL_REPLY_TO || fromAddress,
  };
};

const isEmailConfigured = () => Boolean(getMailConfig());

const getTransporter = () => {
  const config = getMailConfig();
  if (!config) return null;

  const configKey = JSON.stringify(config.transport);
  if (!cachedTransporter || cachedConfig !== configKey) {
    cachedTransporter = nodemailer.createTransport(config.transport);
    cachedConfig = configKey;
  }

  return { transporter: cachedTransporter, config };
};

const buildReservationEmail = (reservation) => {
  const reservationId = reservation._id ? String(reservation._id) : "";
  const type = typeLabels[reservation.type] || reservation.type || "Đặt bàn";
  const date = formatDate(reservation.date);
  const time = reservation.time || "Chưa cập nhật";
  const guests = reservation.guests || "Chưa cập nhật";
  const area = reservation.area || "Sảnh chính";
  const combo = reservation.combo || "Không";
  const notes = reservation.notes || "Không có";

  const rows = [
    ["Mã đặt bàn", reservationId],
    ["Họ tên", reservation.name],
    ["Số điện thoại", reservation.phone],
    ["Email", reservation.email],
    ["Ngày", date],
    ["Giờ", time],
    ["Số khách", `${guests} khách`],
    ["Loại hình", type],
    ["Khu vực ưu tiên", area],
    ["Combo ưu tiên", combo],
    ["Ghi chú", notes],
  ];

  const text = [
    `Xin chào ${reservation.name},`,
    "",
    "AURA đã ghi nhận yêu cầu đặt bàn của bạn. Thông tin đặt bàn:",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Đội ngũ AURA sẽ liên hệ để xác nhận và chuẩn bị bàn phù hợp nhất.",
    "Cảm ơn bạn đã chọn AURA.",
  ].join("\n");

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;color:#8b8172;font-size:13px;border-bottom:1px solid #ead7a51f;">${escapeHtml(label)}</td>
          <td style="padding:12px 0;color:#f7f0df;font-size:14px;text-align:right;border-bottom:1px solid #ead7a51f;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Xác nhận đặt bàn AURA</title>
      </head>
      <body style="margin:0;background:#111111;font-family:Arial,Helvetica,sans-serif;color:#f7f0df;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111111;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#181512;border:1px solid #d4af3733;">
                <tr>
                  <td style="padding:32px 32px 20px;text-align:center;border-bottom:1px solid #d4af3726;">
                    <div style="color:#d4af37;font-size:12px;letter-spacing:3px;text-transform:uppercase;">AURA Restaurant</div>
                    <h1 style="margin:14px 0 0;color:#f7f0df;font-size:28px;line-height:1.25;font-weight:400;">Đặt bàn của bạn đã được ghi nhận</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px;">
                    <p style="margin:0 0 12px;color:#f7f0df;font-size:16px;line-height:1.7;">Xin chào ${escapeHtml(reservation.name)},</p>
                    <p style="margin:0 0 24px;color:#c9bfaa;font-size:14px;line-height:1.8;">
                      Cảm ơn bạn đã đặt bàn tại AURA. Chúng tôi đã nhận được thông tin bên dưới và sẽ liên hệ để xác nhận trong thời gian sớm nhất.
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                      ${detailRows}
                    </table>
                    <p style="margin:28px 0 0;color:#c9bfaa;font-size:13px;line-height:1.7;">
                      Nếu bạn cần thay đổi thông tin đặt bàn, vui lòng phản hồi email này hoặc liên hệ trực tiếp với nhà hàng.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

  return {
    subject: `AURA xác nhận đã nhận đặt bàn - ${reservation.name}`,
    text,
    html,
  };
};

const sendReservationConfirmationEmail = async (reservation) => {
  const email = reservation.email;
  if (!email) return false;

  const mailer = getTransporter();
  if (!mailer) {
    console.warn("Reservation confirmation email skipped: SMTP is not configured.");
    return false;
  }

  const message = buildReservationEmail(reservation);

  await mailer.transporter.sendMail({
    from: `"${mailer.config.from.name}" <${mailer.config.from.address}>`,
    to: email,
    replyTo: mailer.config.replyTo,
    ...message,
  });

  return true;
};

const queueReservationConfirmationEmail = (reservation) => {
  if (!reservation?.email) return false;

  const reservationData =
    typeof reservation.toObject === "function" ? reservation.toObject() : { ...reservation };

  if (!isEmailConfigured()) {
    console.warn("Reservation confirmation email skipped: SMTP is not configured.");
    return false;
  }

  setImmediate(() => {
    sendReservationConfirmationEmail(reservationData)
      .then(() => {
        console.log(`Reservation confirmation email sent to ${reservationData.email}`);
      })
      .catch((err) => {
        console.error("Failed to send reservation confirmation email:", err.message);
      });
  });

  return true;
};

module.exports = {
  isEmailConfigured,
  queueReservationConfirmationEmail,
  sendReservationConfirmationEmail,
};
