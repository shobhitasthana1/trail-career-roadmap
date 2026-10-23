const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Trail Backend API is running..."
    });
});

const PORT = process.env.PORT || 5051;

const startServer = async () => {
    // Connect to MongoDB before accepting traffic. connectDB() exits the
    // process on failure, so the server never reports a successful start
    // while the required database connection has failed.
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
