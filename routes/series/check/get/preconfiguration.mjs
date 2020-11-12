export default function preconfiguration(req, res, next) {
  req.parameters = req.params;
  next();
}
