const parseBearerToken = (headers) => {
  const authHeader = headers["authorization"];
  if (authHeader) {
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
      const accessToken = tokenParts[1];
      return accessToken;
    }
  }
  return null;
};

module.exports = { parseBearerToken };
