import 'reflect-metadata';
import type {
  ConnectionOptions,
  ObjectLiteral,
  ObjectType,
  Repository,
  Connection,
} from 'typeorm';
import { createConnection, getConnection, getConnectionManager } from 'typeorm';

import { SnakeNamingStrategy } from './snakeCaseNamingStrategy.helper';

import { AccountEntity } from 'backend/entities/account.entity';
import { LecturerEntity } from 'backend/entities/lecturer.entity';
import { PasswordResetEntity } from 'backend/entities/passwordReset.entity';
import { QuestionEntity } from 'backend/entities/question.entity';
import { SubjectEntity } from 'backend/entities/subject.entity';
import { TestEntity } from 'backend/entities/test.entity';
import { TestQuestionEntity } from 'backend/entities/testQuestion.entity';

const connectionOptions: Record<string, ConnectionOptions> = {
  default: {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      AccountEntity,
      PasswordResetEntity,
      SubjectEntity,
      LecturerEntity,
      TestEntity,
      QuestionEntity,
      TestQuestionEntity,
    ],
  },
};

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
}

async function updateConnectionEntities(
  connection: Connection,
  entities: any[],
) {
  if (!entitiesChanged(connection.options.entities || [], entities)) return;

  // @ts-ignore
  connection.options.entities = entities;

  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
}

export async function ensureConnection(name = 'default'): Promise<Connection> {
  const connectionManager = getConnectionManager();

  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name);

    if (!connection.isConnected) {
      await connection.connect();
    }

    if (process.env.NODE_ENV !== 'production') {
      await updateConnectionEntities(
        connection,
        connectionOptions[name].entities as any,
      );
    }

    return connection;
  }

  return await connectionManager
    .create({ name, ...connectionOptions[name] })
    .connect();
}

// ================

let connectionReadyPromise: Promise<any> | null = null;

function prepareConnection() {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      // clean up old connection that references outdated hot-reload classes
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        // no stale connection to clean up
      }

      // wait for new default connection
      await createConnection(connectionOptions.default);
    })();
  }

  return connectionReadyPromise;
}

export const getRepo = async <T extends ObjectLiteral>(
  entity: ObjectType<T>,
): Promise<Repository<T>> => {
  await prepareConnection();
  // console.log('prepare Connection!', 'asd');
  // const connection = await ensureConnection();
  return getConnectionManager().get('default').getRepository(entity);
};
