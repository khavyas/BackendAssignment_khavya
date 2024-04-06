import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import User from './user.js'; // Make sure to import the User model

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isSpam: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

User.hasMany(Contact, { as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Contact;

