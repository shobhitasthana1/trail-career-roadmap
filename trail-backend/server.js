const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// basic health-check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: true,
        message: "Trail Backend API is running..."
    });
});

const PORT = process.env.PORT || 5051;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});