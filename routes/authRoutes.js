import { registerUser ,loginUser} from "../controllers/authController.js";


const authRoutes =async(req,res)=>{
    
    if(req.method === "POST" && req.url === "/auth/signup")
      return registerUser(req,res)
    else if(req.method === "POST" && req.url === "/auth/login")
      return loginUser(req,res)
    else {
        res.writeHead(404,{"Content-Type": "application/json"})
        res.end(JSON.stringify({error: "Route not found"}))
    }
}

export default authRoutes;