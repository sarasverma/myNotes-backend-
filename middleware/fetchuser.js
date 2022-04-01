const jwt = require("jsonwebtoken");

const JWT_SECRET = "thisisasecret";

// next is the next fuction to be called
const fetchuser = (req, res, next) => {
  // check request header for auth-token
  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({ error: "Please authenciate using valid credentials" });
  }
  try {
    // verify token using jwt secret
    const data = jwt.verify(token, JWT_SECRET);
    // adding user to request
    req.user = data.user;
    // call next function
    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "Please authenciate using valid credentials" });
  }
};

module.exports = fetchuser;
