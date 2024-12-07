// global setup
export default async () => {
  process.env = Object.assign(process.env, { JWT_SECRET: 'jwt-key' });
};
