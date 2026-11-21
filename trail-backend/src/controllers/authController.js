const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to issue standard JWT bearer token
function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Clean user object for client consumption
function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    bio: user.bio || '',
    phone: user.phone || '',
    location: user.location || '',
    careerGoal: user.careerGoal || '',
    skills: user.skills || [],
    bookmarkedResources: user.bookmarkedResources || [],
    createdAt: user.createdAt,
  };
}

// Register a new user account
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      authProvider: 'local',
    });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// Authenticate user with email and password
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// Google OAuth verification
async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!googleRes.ok) {
      return res.status(401).json({ success: false, message: 'Invalid Google credential' });
    }

    const payload = await googleRes.json();

    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ 
        success: false, 
        message: 'Google credential audience mismatch' 
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not retrieve email from Google' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        avatar: picture || null,
        authProvider: 'google',
      });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// Get current logged-in user profile
async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

// Update profile fields for authenticated user
async function updateProfile(req, res, next) {
  try {
    const { name, bio, phone, location, careerGoal, skills, avatar } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = String(name).trim();
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (location !== undefined) updates.location = String(location).trim();
    if (careerGoal !== undefined) updates.careerGoal = String(careerGoal).trim();
    if (avatar !== undefined) updates.avatar = avatar;
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        updates.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        updates.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, googleLogin, getMe, updateProfile };
