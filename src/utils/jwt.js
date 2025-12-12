export function getUserEmail() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch (e) {
    console.error("JWT decode failed", e);
    return null;
  }
}
