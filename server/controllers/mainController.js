const keycloakConfig = require("./../keycloak.json");


exports.login = (req, res, next) => {
  res.render("index");
};

exports.logout = (req, res, next) => {
  req.logout(); 
  req.session.destroy(); 
  res.redirect(keycloakConfig.authServerUrl + "/realms/" + keycloakConfig.realm + "/protocol/openid-connect/logout");
  // PONER IP SI SE HACE EN SERVIDOR EXTERNO
};


exports.logged = (req, res, next) => {
  res.render("logged_index");
};