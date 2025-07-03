import User from "../models/User.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || '',
        createdAt: user.createdAt,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, role, company } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const newUser = new User({ name, email, password, role, company });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company || "",
        _id: newUser._id,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
};
