const mongoose = require("mongoose");

const mongooseURI = "mongodb://localhost:27017/saras";
// mongoose
//   .connect("mongodb://localhost:27017/saras")
//   .then(() => {
//     console.log("Successfully connected!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

connectToMongo = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Successfully connected !");
  });
};

module.exports = connectToMongo;
