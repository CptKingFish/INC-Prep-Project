const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  JWTAccessTokenKey: process.env.JWT_ACCESS_TOKEN_KEY,
  JWTRefreshTokenKey: process.env.JWT_REFRESH_TOKEN_KEY,
  cryptr_secret: process.env.CRYPTR_SECRET,
  cookie_secret: process.env.COOKIE_SECRET,
  //   access_token_secret: process.env.COOKIE_SECRET,
  //   refresh: process.env.CRYPTR_SECRET,
  //   mailtrapUserName: process.env.MAILTRAP_USERNAME,
  //   mailtrapPassword: process.env.MAILTRAP_PASSWORD,

  ssl: {
    rejectUnauthorized: false,
  },
};
