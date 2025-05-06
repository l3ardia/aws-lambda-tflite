export const envName = process.env.ENV as string;

export const isProd = (env: string) => env === 'prod';
export const isDev = (env: string) => env === 'dev';
export const isLocal = (env: string) => env === 'local';
