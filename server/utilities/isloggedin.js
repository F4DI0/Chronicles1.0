const isLoggedIn = function (req, res, next) {
    console.log("Session:", req.session); // Log the session
    console.log("Headers:", req.headers); // Log the request headers
  
    if (!req.session.login) {
      console.log("User not logged in. Redirecting or sending 401...");
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.redirect('/login');
    }
    next();
  };
  
  module.exports.isLoggedIn = isLoggedIn;