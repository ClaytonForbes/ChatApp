const {loadAlerts} = require("./setupalerts")
const dbRtns = require("./dbroutines");
const { coll } = require("./config");
const resolvers = {
 setupalerts: async () => {
  return loadAlerts();
 },
 alerts: async () => {
  let db = await dbRtns.getDBInstance();
  return await dbRtns.findAll(db, coll, {}, {})
  },
  alertsforregion: async args => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, coll, {region: args.region})
  },
  alertsforsubregion: async args => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, coll, {subregion: args.subregion})
  },  
  regions: async args => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findUniqueValues(db, coll, "region")
  },
  subregions: async args => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findUniqueValues(db, coll, "subregion")
  },
  addAdvisory: async (args) => {
    let db = await dbRtns.getDBInstance();
    let advisory = { name: args.name, country: args.country, text: args.text,  date: args.date};
    let results = await dbRtns.addOne(db, "advisories", advisory);
    return results.acknowledged ? advisory : null;
  },
  advisories: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, "advisories", {}, {})
  },
 };

 module.exports = { resolvers };