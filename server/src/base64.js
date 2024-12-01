export function decodeBase64(input) {
  return Buffer.from(input, "base64url").toString("utf-8");
}
export function encodeBase64(input) {
  return Buffer.from(input).toString("base64url");
}
