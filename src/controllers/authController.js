const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper ────────────────────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── POST /api/v1/auth/register ────────────────────────────────────────────────
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

    const user = await User.create({ name, email, password, authProvider: 'local' });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/v1/auth/login ───────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
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
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/v1/auth/google ──────────────────────────────────────────────────
/**
 * The frontend sends the Google credential token (from Google Identity Services).
 * We verify it on the backend using Google's tokeninfo endpoint.
 * We never trust a name/email sent directly by the frontend.
 */
async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    // Verify the token with Google
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!googleRes.ok) {
      return res.status(401).json({ success: false, message: 'Invalid Google credential' });
    }

    const payload = await googleRes.json();

    // Confirm the token was issued for our app
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ success: false, message: 'Google credential audience mismatch' });
    }

    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not retrieve email from Google' });
    }

    // Find existing user or create a new one
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google ID if the user registered with email/password previously
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        authProvider: 'google',
      });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/auth/me ───────────────────────────────────────────────────────
async function getMe(req, res, next) {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select('-password -googleId').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, googleLogin, getMe };
