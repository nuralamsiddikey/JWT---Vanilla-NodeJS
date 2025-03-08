import http from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;
const users = [];

const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(JSON.parse(body || "{}")));
    req.on("error", (err) => reject(err));
  });
};

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/register") {
    const { username, password } = await parseRequestBody(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User created successfully" }));
  } else if (req.method === "POST" && req.url === "/login") {
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
  } else if (req.method === "GET" && req.url === "/profile") {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.writeHead(401, { "Content-Type": "application/json" });
     return res.end(JSON.stringify({ error: "Access denied" }));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.writeHead(403, { "Content-Type": "application/json" });
       return res.end(JSON.stringify({ error: "Forbidden" }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Welcome to your profile", user }));
    }); 
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
