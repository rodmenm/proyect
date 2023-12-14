exports.login = (req, res, next) => {
  res.render("index");
};

exports.logged = (req, res, next) => {
  res.render("logged_index");
};