
import sequelize from '../src/sequelize.js'; 
import User from '../src/models/user.js';
import Contact from '../src/models/contact.js'; 
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const NUM_USERS = 10; // Number of users to create
const CONTACTS_PER_USER = 5; // Number of contacts per user

const createRandomUser = async () => {
    const hashedPassword = await bcrypt.hash('password123', 10); // Using a common password for all, hashed
    return User.create({
      name: faker.name.fullName(), // Corrected from faker.person.fullName() to faker.name.fullName()
      phoneNumber: faker.phone.number(), // Corrected from faker.phone.phoneNumber() to faker.phone.number()
      emailAddress: faker.internet.email(),
      password: hashedPassword,
    });
  };
  
const createRandomContact = (userId) => {
    return Contact.create({
      name: faker.name.fullName(), // Corrected from faker.person.fullName() to faker.name.fullName()
      phoneNumber: faker.phone.number(), // Corrected from faker.phone.phoneNumber() to faker.phone.number()
      emailAddress: faker.internet.email(),
      isSpam: faker.datatype.boolean(),
      userId: userId,
    });
};

const populateData = async () => {
  try {
    await sequelize.sync({ force: true }); // Be cautious, as this will drop the database tables and recreate them

    for (let i = 0; i < NUM_USERS; i++) {
      const user = await createRandomUser();
      for (let j = 0; j < CONTACTS_PER_USER; j++) {
        await createRandomContact(user.id);
      }
    }

    console.log('Data population complete.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

populateData();
