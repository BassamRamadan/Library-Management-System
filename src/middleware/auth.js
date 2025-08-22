import basicAuth from 'basic-auth';

export function requireBasicAuth(req, res, next) {
  const user = basicAuth(req);
  const expectedUser = process.env.BASIC_AUTH_USER || 'admin';
  const expectedPass = process.env.BASIC_AUTH_PASS || 'admin123';

  if (!user || user.name !== expectedUser || user.pass !== expectedPass) {
    res.set('WWW-Authenticate', 'Basic realm="library"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
