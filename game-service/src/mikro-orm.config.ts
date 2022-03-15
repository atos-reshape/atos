import { Logger } from '@nestjs/common';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Options } from '@mikro-orm/core';

const logger = new Logger('MikroORM');
const config = {
  type: 'postgresql',
  dbName: process.env.DB_NAME,
  entities: ['./dist/**/*.entity.js', './dist/database/entities/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts', './src/database/entities/*.entity.ts'],
  debug: true,
  highlighter: new SqlHighlighter(),
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
  logger: logger.log.bind(logger),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  registerRequestContext: false,
  allowGlobalContext: true,
} as Options;

export default config;
