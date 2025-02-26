"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'gestion_empleados',
    entities: ['src/**/*.entity.ts'], // Cambiado para desarrollo
    migrations: ['src/migrations/*.ts'], // Cambiado para desarrollo
});
exports.default = AppDataSource;
