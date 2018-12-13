let express = require("express");
let icalendar = require("./icalendar");
let app = express();

app.listen(8080, (err) => {
  if (err) console.error("error starting server", err);
  else console.log("server started");
});

app.use("/", express.static("./", {extensions: ["html"]}));