export { sendJSON, sendError };

function sendJSON(res, status, data) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  const result = JSON.stringify(data);
  res.end(result);
}

function sendError(res, status, message) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  let result = [{ error: message }];
  result = JSON.stringify(result);
  res.end(result);
}
