const express = require("Express");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const port = 3000;

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello saras verma");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});