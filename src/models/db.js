const sqlite3 = require("sqlite3").verbose();

const usersDb = new sqlite3.Database("test.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the users database.");
});

const surveysDb = new sqlite3.Database("surveys.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the surveys database.");
});

module.exports = { usersDb, surveysDb };