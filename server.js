require("dotenv").config();
require("express-async-errors");
const express = require("express");
const path = require('path');
const fs = require('fs');

const cors = require("cors");
const { xss } = require("express-xss-sanitizer");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/courses");
const projectRoutes = require("./routes/projects");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

const connectDB = require("./db/connect");

// async error
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(xss());

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/user", userRoutes);

// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/surprise", (req, res) => {
    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start  = async () => {
    try {

        const projectDir = path.join(__dirname, "./temp");
        if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir);
        
        // connect DB
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

start();
