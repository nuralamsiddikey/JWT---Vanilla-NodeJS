import jwt from "jsonwebtoken";

export const getProfile = async(req,res)=> {
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
}