import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let authtoken;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      authtoken = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(authtoken, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, authtoken failed" });
    }
  }

  if (!authtoken) {
    return res.status(401).json({ message: "Not authorized, no authtoken" });
  }
};

export default protect;
