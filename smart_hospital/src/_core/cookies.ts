export function getSessionCookieOptions(req: any) {
  return { httpOnly: true, secure: false, path: '/' };
}
