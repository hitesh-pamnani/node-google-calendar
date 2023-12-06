const credentials = {
  clientId: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",
  redirectUri: process.env.REDIRECT_URI || "http://localhost:8080",
  appRedirectUri: process.env.APP_REDIRECT_URI || "",
};

module.exports = { credentials };
