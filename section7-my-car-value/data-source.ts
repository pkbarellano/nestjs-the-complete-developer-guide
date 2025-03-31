// src/data-source.ts
import { DataSource } from 'typeorm';
// import { User } from './src/users/user.entity';
// import { Report } from './src/reports/report.entity';

let dbOptions: any = {
    type: 'sqlite',
    synchronize: false,
    migrations: ['src/migrations/*.ts'], // or *.js in production
    entities: [],
};

switch (process.env.NODE_ENV) {
    case 'development':
        dbOptions = {
            ...dbOptions,
            database: 'db.sqlite',
            entities: ['src/**/*.entity.ts'],
        };
        break;
    case 'test':
        dbOptions = {
            ...dbOptions,
            database: 'test.sqlite',
            entities: ['src/**/*.entity.ts'],
            migrationsRun: true
        };
        break;
    case 'production':
        
        break;
    default:
        throw new Error('Unknown NODE_ENV');
}

export const AppDataSource = new DataSource(dbOptions);
