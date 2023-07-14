const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  GOCALERTS: process.env.GOCALERTS,
  ISOCOUNTRIES: process.env.ISOCOUNTRIES,
  atlas: process.env.DBURL,
  appdb: process.env.DB,
  port: process.env.PORT,
  coll : process.env.COLL
};
