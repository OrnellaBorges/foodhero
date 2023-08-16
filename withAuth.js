const jwt = require("jsonwebtoken");
const secret = process.env.SECRET

const withAuth = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log("Token dans withAuth", token);

  jwt.verify(token, secret, (err, decode) => {
    console.log(decode);

    if (err) {
      console.log(err);
      res.json({ status: 401, err: err });
    } else {
      req.id = decode.id;
      req.email = decode.email;
      next();
    }
  });
};

module.exports = withAuth;