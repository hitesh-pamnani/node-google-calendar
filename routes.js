const express = require("express");
const axios = require("axios");
const { credentials } = require("./credentials");
const { parseBearerToken } = require("./util");
const router = express.Router();

router.get("/authorise", (request, response) => {
  response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${credentials.clientId}` +
      `&redirect_uri=${credentials.redirectUri}` +
      `&response_type=code` +
      `&scope=https://www.googleapis.com/auth/calendar.readonly`
  );
});

router.get("/redirect", (request, response) => {
  const data = request.query;
  if (!data.code) {
    response.status(500).send({
      message: "Unable to fetch authorization code",
    });
  }
  const oAuthData = {
    client_id: `${credentials.clientId}`,
    client_secret: `${credentials.clientSecret}`,
    redirect_uri: `${credentials.redirectUri}`,
    grant_type: "authorization_code",
    code: `${data.code}`,
  };
  axios
    .post("https://oauth2.googleapis.com/token", oAuthData)
    .then((axiosResponse) => {
      const accessToken = axiosResponse.data.access_token;
      const refreshToken = axiosResponse.data.refresh_token;
      response.redirect(
        `${credentials.appRedirectUri}?` +
          `access_token=${accessToken}` +
          `&refresh_token=${refreshToken}`
      );
    });
});

router.get("/calendars", (request, response) => {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    response.status(400).send({
      message: "Access token missing in auth headers.",
    });
  }
  axios
    .get("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((axiosResponse) => {
      response.send({
        data: axiosResponse.data,
      });
    });
});

router.get("/calendars/:id", (request, response) => {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    response.status(400).send({
      message: "Access token missing in auth headers.",
    });
  }
  const id = request.params.id;
  axios
    .get(`https://www.googleapis.com/calendar/v3/calendars/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((axiosResponse) => {
      response.send({
        data: axiosResponse.data,
      });
    });
});

router.get("/calendars/:id/events", (request, response) => {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    response.status(400).send({
      message: "Access token missing in auth headers.",
    });
  }
  const id = request.params.id;
  axios
    .get(`https://www.googleapis.com/calendar/v3/calendars/${id}/events`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((axiosResponse) => {
      response.send({
        data: axiosResponse.data,
      });
    });
});

router.get("/calendars/:calendarId/events/:eventId", (request, response) => {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    response.status(400).send({
      message: "Access token missing in auth headers.",
    });
  }
  const calendarId = request.params.calendarId;
  const eventId = request.params.eventId;
  axios
    .get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((axiosResponse) => {
      response.send({
        data: axiosResponse.data,
      });
    });
});

module.exports = router;
