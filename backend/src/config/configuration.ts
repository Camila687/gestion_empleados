export default () => ({
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'gestion_empleados',
    },
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'default',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'default',
      s3Bucket: process.env.AWS_S3_BUCKET || 'default-bucket',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secretKey',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  });