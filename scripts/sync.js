import sequelize from '../src/sequelize.js'; // Corrected path to go up one directory level
import User from '../src/models/user.js';
import Contact from '../src/models/contact.js'; // Corrected path for the Contact model

async function syncModels() {
  try {
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error('Unable to sync models:', error);
  }
}

if (process.env.NODE_ENV !== 'production') {
  syncModels();
} else {
  console.log('Sync not allowed in production');
}


// import sequelize from './src/sequelize.js'; // Ensure the path is correct
// import User from './models/user.js';
// import Contact from './models/contact.js'; // Import the Contact model


// // This will create the table, if it doesn't exist (and do nothing if it already exists)
// sequelize.sync()
//   .then(() => {
//     console.log('Users table created successfully!');
//   })
//   .catch(error => {
//     console.error('Unable to create table:', error);
//   });
  
// async function syncModels() {
//   try {
//     await sequelize.sync({ force: false }); 
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error('Unable to sync models:', error);
//   }
// }

// if (process.env.NODE_ENV !== 'production') {
//   syncModels();
// } else {
//   console.log('Sync not allowed in production');
// }