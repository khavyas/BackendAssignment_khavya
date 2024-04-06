import User from './models/user.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import auth, { issueToken } from './authMiddleware.js'; 
import Contact from './models/contact.js';
// import Sequelize, { Op } from 'sequelize';
import Sequelize from 'sequelize';

const app = express();
app.use(express.json());

app.get('/secure-data', auth, (req, res) => {
    if (req.user) {
      const secureData = {
        message: 'This is secure data',
      };
      res.json(secureData);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/register', async (req, res) => {
  try {
    const { name, phoneNumber, emailAddress, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with the same phone number." });
    }

    let user = await User.create({
      name,
      phoneNumber,
      emailAddress,
      password,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    let user = await User.findOne({ where: { phoneNumber } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = issueToken({ id: user.id });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/contacts/add', auth, async (req, res) => {
  try {
    const { name, phoneNumber, emailAddress } = req.body;
    const userId = req.user.id;

    // Check if contact already exists for the user
    const existingContact = await Contact.findOne({ where: { phoneNumber, userId } });
    if (existingContact) {
      return res.status(400).json({ message: "Contact with this phone number already exists." });
    }

    let contact = await Contact.create({
      name,
      phoneNumber,
      emailAddress,
      userId,
    });
    res.status(201).json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete('/contacts/delete', auth, async (req, res) => {
  try {
    const { name, phoneNumber } = req.query;
    const userId = req.user.id;

    const conditions = {
      userId: userId
    };
    
    if (name) conditions.name = name;
    if (phoneNumber) conditions.phoneNumber = phoneNumber;

    const result = await Contact.destroy({
      where: conditions,
    });

    if (result === 0) {
      return res.status(404).send('Contact not found or does not belong to the user');
    }

    res.send('Contact deleted successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.put('/contacts/modify', auth, async (req, res) => {
  try {
    const { searchName, searchPhoneNumber, name, phoneNumber, emailAddress } = req.body;
    const userId = req.user.id;

    const conditions = { userId: userId };
    if (searchName) conditions.name = searchName;
    if (searchPhoneNumber) conditions.phoneNumber = searchPhoneNumber;

    const [updated] = await Contact.update({ name, phoneNumber, emailAddress }, { where: conditions });

    if (updated) {
      const updatedContacts = await Contact.findAll({ where: conditions });
      return res.status(200).json(updatedContacts);
    }
    throw new Error('Contact not found');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/mark-spam', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Mark the user as spam if the phone number belongs to a registered user
    const userUpdatePromise = User.update({ isSpam: true }, { where: { phoneNumber } });

    // Mark the contact as spam if the phone number exists in contacts
    const contactUpdatePromise = Contact.update({ isSpam: true }, { where: { phoneNumber } });

    await Promise.all([userUpdatePromise, contactUpdatePromise]);

    res.json({ message: 'Phone number marked as spam successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/search/name', auth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Please provide a search query." });

    // Use Sequelize's `like` operator for partial matching
    // Prioritize names starting with the query
    const users = await User.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `${query}%`
        }
      },
      attributes: ['name', 'phoneNumber', 'isSpam']
    });

    const contacts = await Contact.findAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `${query}%`
        }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'phoneNumber', 'isSpam']
      }],
      attributes: ['name', 'phoneNumber']
    });

    const results = [...users, ...contacts.map(contact => contact.user)].filter(Boolean);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/search/phone', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    if (!phoneNumber) return res.status(400).json({ message: "Please provide a phone number." });

    const user = await User.findOne({
      where: { phoneNumber },
      attributes: ['name', 'phoneNumber', 'isSpam']
    });

    if (user) {
      return res.json([user]);
    }

    const contacts = await Contact.findAll({
      where: { phoneNumber },
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'phoneNumber', 'isSpam']
      }],
      attributes: ['name', 'phoneNumber']
    });

    if (contacts.length) {
      const results = contacts.map(contact => contact.user).filter(Boolean);
      return res.json(results);
    }

    return res.status(404).json({ message: "No matches found." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

