
const accessCookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000
};

const refreshCookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

module.exports = { accessCookieOptions , refreshCookieOptions}