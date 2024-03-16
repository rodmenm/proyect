const keycloakConfig = require("./../keycloak.json");


exports.login = (req, res, next) => {
  res.render("index");
};

exports.logout = (req, res, next) => {
  req.session.destroy(); 
  res.redirect(keycloakConfig.auth-server-url + "/realms/" + keycloakConfig.realm + "/protocol/openid-connect/logout");
  // res.redirect("http://34.175.236.187:8080/realms/" + keycloakConfig.realm + "/protocol/openid-connect/logout");
  // PONER IP SI SE HACE EN SERVIDOR EXTERNO
};


exports.logged = (req, res, next) => {
  res.render("logged_index");
};