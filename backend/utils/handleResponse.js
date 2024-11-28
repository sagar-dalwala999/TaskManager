const handleResponse = (
  res,
  status = 200,
  success = true,
  message = "Success",
  data
) => {
  return res.status(status).json({ success, message, data});
};

export default handleResponse;
