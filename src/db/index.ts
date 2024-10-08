import initSqlJs, { Database } from 'sql.js/dist/sql-asm.js';
import { DataSource } from 'typeorm';

import { Fishing } from '../entities/fishing/v1/db';
import { RecentCatch } from '../entities/recent-catch/v1/db';
import { Collection } from '../entities/collection/v1/db';
import { User } from '../entities/users/db';

// TODO figure out migrations
export async function initDb(
    bytes: Uint8Array = Uint8Array.from([])
): Promise<Database> {
    const AppDataSource = new DataSource({
        type: 'sqljs',
        synchronize: true, // TODO we should figure out real migrations for people
        entities: [Fishing, RecentCatch, User, Collection],
        driver: await initSqlJs({}),
        database: bytes,
        logging: true,
    });

    const _appDataSource = await AppDataSource.initialize();

    return _appDataSource.driver as unknown as Database;
}
