import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return token;

  // res.cookie("jwt", token, {
  //   maxAge: 15 * 24 * 60 * 60 * 1000,
  //   // httpOnly: true, // prevent XSS attacks and cross-site scripting attacks
  //   secure: false,
  //   sameSite: "lax", // CSRF attacks and cross-site request forgery attacks
  // });
};

export { generateToken };
