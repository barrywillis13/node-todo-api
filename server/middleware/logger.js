var logger = (req, res, next) => {
  console.log(`Request recieved at ${new Date().toISOString()} | ${req.method} ${req.url}`)
  next();
}

module.exports = {logger}
