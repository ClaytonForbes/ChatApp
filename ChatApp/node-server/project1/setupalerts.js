const util = require("./utilities")
const dbRtns = require("./dbroutines")
const {GOCALERTS, ISOCOUNTRIES, coll} = require("./config");

const loadAlerts = async ()=>{
  let str = "";
  try{
  let db = await dbRtns.getDBInstance();
  
  let results = await dbRtns.deleteAll(db, coll);
  
  str += `Deleted ${results.deletedCount} documents from alerts collection.`;
     
  let alertJson = await util.getJSONFromWWWPromise(GOCALERTS);
 
  str += `Retrieved Alert JSON from remote web site.`;

  let data = await util.getJSONFromWWWPromise(ISOCOUNTRIES);
  str += `Retrieved Country JSON from remote web site.`;



  await Promise.allSettled(
    data.map((country) => {
      let alertObj;
      let code = country["alpha-2"];
      if(country["alpha-2"] in alertJson.data)
      {
        alertObj  = {
        country: country["alpha-2"],
        name: country.name,
        text: alertJson.data[code].eng["advisory-text"],
        date: alertJson.data[code]["date-published"].date,
        region: country.region,
        subregion: country["sub-region"]
        }
      }
      else{
        alertObj  = {
          country: country["alpha-2"],
          name: country.name,
          text: "No travel alerts",
          date: "",
          region: country.region,
          subregion: country["sub-region"]
          }
      }
      dbRtns.addOne(db, coll, alertObj)
    })
  )

  
  let allAlerts = await dbRtns.findAll(db, coll, {}, {})
  str += `There are ${allAlerts.length} documents currently in the ${coll} collection.`;

  let country = await dbRtns.findOne(db, coll, { country: "SO" });
  } catch (err) {
    console.log(err);
    } finally {
      return { results: str };
    }
} 
  

module.exports = { loadAlerts };