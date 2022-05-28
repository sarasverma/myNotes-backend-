const express = require("Express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const port = 5000;

// adding a middle ware(for handling req body and other stuff)
app.use(express.json());

// for cors request handling (React)
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello saras verma");
});

app.listen(port, () => {
  console.log(`MyNotes backend app listening at http://localhost:${port}`);
});
