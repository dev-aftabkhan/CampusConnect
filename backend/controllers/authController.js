const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const generateToken = require('../middleware/authMiddleware').generateToken;

 

exports.register = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const [userByEmail, userByPhone, userByUsername] = await Promise.all([
      userService.findUserByEmail(email),
      userService.findUserByPhone(phone),
      userService.findUserByUsername(username)
    ]);

    if (userByUsername) return res.status(400).json({ message: 'Username already taken' });
    if (userByEmail) return res.status(400).json({ message: 'Email already exists' });
    if (userByPhone) return res.status(400).json({ message: 'Phone number already registered' });

    const user = await userService.createUser({ username, email, phone, password });
    const token = generateToken(user.user_id);

    res.status(201).json({ user: { id: user.user_id, username, email, phone }, token });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body; // identifier = email or phone

  try {
    const user = await userService.findUserByEmailOrPhone(identifier);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.user_id);
    res.json({ user: { id: user.user_id, username: user.username, email: user.email, phone: user.phone }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
