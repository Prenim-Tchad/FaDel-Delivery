const sanitizeEnvValue = (value) => {
  if (!value) return '';
  return value.replace(/^"(.*)"$/, '$1').trim();
};

export const buildDatabaseUrl = (env = process.env) => {
  const rawDatabaseUrl = sanitizeEnvValue(env.DATABASE_URL);

  if (rawDatabaseUrl && !rawDatabaseUrl.includes('${')) {
    return rawDatabaseUrl;
  }

  const user = sanitizeEnvValue(env.DB_USER);
  const password = sanitizeEnvValue(env.DB_PASSWORD);
  const host = sanitizeEnvValue(env.DB_HOST) || 'localhost';
  const port = sanitizeEnvValue(env.DB_PORT) || '5432';
  const database = sanitizeEnvValue(env.DB_NAME);

  if (!user || !password || !database) {
    throw new Error('Database configuration is incomplete. Check DATABASE_URL or DB_* values in .env.');
  }

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?schema=public`;
};

export default buildDatabaseUrl;
