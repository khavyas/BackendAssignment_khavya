
import sequelize from '../src/sequelize.js';
import User from '../src/models/user.js';
import Contact from '../src/models/contact.js';

const createTables = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

createTables();
