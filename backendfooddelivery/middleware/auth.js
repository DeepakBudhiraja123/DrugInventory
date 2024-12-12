import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  // console.log(token);
  
  if (!token) {
    return res.json({
      success: false,
      message: `${token} is the token`,
    })
  }
    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = tokenDecode.id;
      next();
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Error",
      });
  }
};

export default authMiddleware;
