const userModel = require('../models/user');
const { generateToken } = require('../models/user');

module.exports = {
  async register(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      
      if (password !== confirmPassword) {
        return res.render('users/register', { 
          error: 'Passwords do not match' 
        });
      }

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.render('users/register', { 
          error: 'Email already in use' 
        });
      }

      const userId = await userModel.create({
        username,
        email,
        password,
        image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
      });

      const token = generateToken({ 
        id: userId, 
        email, 
        role: 'user' 
      });

      res.cookie('accessToken', token, { 
        httpOnly: true,
        maxAge: 3600000 // 1 hour
      });

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Registration failed' 
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findByEmail(email);

      if (!user) {
        return res.render('users/login', { 
          error: 'Invalid credentials' 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('users/login', { 
          error: 'Invalid credentials' 
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.cookie('accessToken', token, { 
        httpOnly: true,
        maxAge: 3600000 // 1 hour
      });

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Login failed' 
      });
    }
  },

  async profile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      res.render('users/profile', { user });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to load profile' 
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { username, email, password } = req.body;
      const updates = { username, email };

      if (password) {
        updates.password = password;
      }

      await userModel.update(req.user.id, updates);
      res.redirect('/users/profile');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { 
        message: 'Failed to update profile' 
      });
    }
  }
};