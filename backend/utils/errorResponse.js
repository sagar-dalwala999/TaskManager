const errorResponse = (
  res,
  status = 500,
  success = false,
  message = "Something went wrong"
) => {
  return res.status(status).json({ success, message });
};

export default errorResponse;
