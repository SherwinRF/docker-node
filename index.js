const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const redis = require('redis');
let redisStore = require('connect-redis')(session);

const { MONGO_USER, MONGO_PASSWORD, MONGO_PORT, MONGO_IP, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require("./config/config");
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}?authSource=admin`;

// Function to Connect to MongoDB database, and retry if Database is not up & running
const connectWithRetry = () => {
    mongoose.connect(mongoURL)
    .then(() => console.log("Successfully Connected to DB!!"))
    .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });
}
connectWithRetry();

const app = express();
const port = process.env.PORT || 3000;

app.enable("trust proxy");
app.use(cors({}));
// app.use(session({
//     store: new redisStore({ client: redisClient }),
//     secret: SESSION_SECRET,
//     // resave: false,
//     // saveUninitialized: false,
//     cookie: {
//         // secure: false,
//         httpOnly: true,
//         maxAge: 60000
//     }
// }));

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("Hey There from Docker");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));