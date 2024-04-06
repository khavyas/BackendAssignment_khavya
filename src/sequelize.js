import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('globaldb', 'postgres', 'SAkthi@1234', {
  host: 'globaldb.postgres.database.azure.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  logging: console.log,
});

export default sequelize;