import { env } from "../config/env.js";

const getCookieOptions = () => ({
  httpOnly: true,

  secure: env.REFRESH_COOKIE_SECURE,

    sameSite:
      env.NODE_ENV === "production"
        ? "none"
        : "lax",

  maxAge:
    env.REFRESH_TOKEN_DAYS *
    24 *
    60 *
    60 *
    1000,

  path: "/api/v1",
});

export const setRefreshTokenCookie = (
  res,
  token
) => {
  res.cookie(
    env.REFRESH_COOKIE_NAME,
    token,
    getCookieOptions()
  );
};

export const clearRefreshTokenCookie = (
  res
) => {
  res.cookie(
    env.REFRESH_COOKIE_NAME,
    "",
    {
      ...getCookieOptions(),
      maxAge: 0,
    }
  );
};

/*
 * We don't require cookie-parser.
 */
export const getRefreshTokenFromRequest = (
  req
) => {
  const cookieHeader =
    req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim());

  const target =
    `${env.REFRESH_COOKIE_NAME}=`;

  const cookie = cookies.find(
    (item) => item.startsWith(target)
  );

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(
    cookie.substring(target.length)
  );
};