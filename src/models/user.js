import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js'; 
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  // Existing fields
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isSpam: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // New field for password
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash password before User is created
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});



export default User;




