"use strict";

import auth0 from "../../utils/auth0";

export default async (req, res) => {
  try {
    await auth0.handleLogin(req, res);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).end(err.message);
  }
};