import crypto from "crypto";

const codeVerifier = crypto.randomBytes(96).toString("base64url");
const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

const getState = () => {
    return crypto.randomBytes(96).toString("base64url");
}

export { codeVerifier, codeChallenge, getState };