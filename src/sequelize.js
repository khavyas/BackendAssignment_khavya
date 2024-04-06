import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('globaldb', 'postgres', 'SAkthi@1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

export default sequelize;