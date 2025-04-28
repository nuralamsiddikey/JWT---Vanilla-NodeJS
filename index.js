import http from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import parseRequestBody from "./utils/parseRequestBody.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const port = process.env.PORT || 8000


const server = http.createServer(async (req, res) => {

  if (req.url.startsWith("/auth")) 
    return authRoutes(req, res);
  
  else if (req.url.startsWith("/profile")) 
    return profileRoutes(req,res)

  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
