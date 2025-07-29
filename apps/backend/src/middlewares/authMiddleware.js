import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// 1. Auth required – blocks unauthenticated users
export const authRequired = (req, res, next) => {
  const authToken = req.header("Authorization")?.split(" ")[1];  // Expecting Bearer token
  console.log("authToken", authToken);
  // console.log("tokenn", tokenn);
  if (!authToken)
    return res.status(401).json({ msg: "Unauthorized, JWT token is required" });

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ msg: "Unauthorized, JWT token is wrong or expired", err });
  }
};

// 2. Auth optional – lets anonymous users pass through
export const authOptional = (req, res, next) => {
  const authToken = req.header("Authorization")?.split(" ")[1];
  console.log("authToken", authToken);
  if (!authToken) {
    return next(); // proceed anonymously
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    console.warn("Optional auth: invalid token");
  }

  next();
};
