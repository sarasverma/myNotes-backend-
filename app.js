const express = require("Express");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const port = 5000;

// adding a middle ware(for handling req body and other stuff)
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello saras verma");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
