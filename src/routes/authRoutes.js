const jwt = require("jsonwebtoken");
const db = require("../models/db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

exports.login = (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    db.usersDb.get(query, [username], (error, user) => {
    if (error) {
        return res.status(500).send({
            success: false,
            message: "Error fetching user from database",
        });
    }
    if (!user) {
        // Create a new user
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.usersDb.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error" });
            }
            const query = "SELECT * FROM users WHERE username = ?";
            db.usersDb.get(query, [username], (error, newUser)=>{
                if (error) {
                    return res.status(500).send({
                        success: false,
                        message: "Error fetching user from database",
                    });
                }
                const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1d",});
                db.usersDb.run(
                    "UPDATE users SET token = ? WHERE id = ?",
                    [token, newUser.id],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: "Internal server error" });
                        }
                        return res.status(200).json({ token, user_id: newUser.id, username, msg: "User created in db" });
                    }
                );
            })
            //const newUser = { id: this.lastID, username };
            
        });
    } else {
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return res
        .status(404)
        .json({ user_id: user.id, username, msg: "User found in db, but password doesn't match" });
    }
    // Check if the stored token is still valid
    try {
        const decoded = jwt.verify(user.token, process.env.JWT_SECRET);
        if (decoded) {
            return res.status(200).json({ token: user.token, user_id: user.id, username, msg: "User found in db with an active jwt" });
        }
    } catch (error) {
        // Generate a new token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d",});
        db.usersDb.run(
            "UPDATE users SET token = ? WHERE id = ?",
            [token, user.id],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: "Internal server error" });
                }
                return res.status(200).json({ token, user_id: user.id, username, msg: "User found in db, issuing a new jwt" });
            }
        );}
    }});
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).json({
        msg: "Access Denied, No Token Provided",
        status: 401
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
        return res.status(400).json({
        msg: "Invalid Token",
        status: 400
        });
    }
    db.usersDb.get(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (error, user) => {
        if (error) {
            return res.status(500).send({
            success: false,
            message: "Error fetching user from database",
            });
        }
        if (!user) {
            return res.status(404).json({
            msg: "User not found in the database",
            status: 404
            });
        }
        const tokenExp = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenExp < currentTime) {
            return res.status(401).json({
            msg: "Token has expired, please log in again",
            status: 401
            });
        }
        req.user = decoded;
        next();
        }
    );
    });
    };