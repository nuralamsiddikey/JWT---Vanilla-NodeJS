import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import parseRequestBody from "../utils/parseRequestBody.js";

let users = []

export const registerUser = async (req, res) => {
  const { username, password } = await parseRequestBody(req);
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "User created successfully" }));
};

export const loginUser = async (req, res) => {
 const { username, password } = await parseRequestBody(req);
    const user = users.find((user) => user.username === username);

    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid username" }));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid password" }));
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ token }));

};
