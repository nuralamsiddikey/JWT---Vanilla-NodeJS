import { getProfile } from "../controllers/profileController.js";


const profileRoutes = async(req,res)=> {
  if(req.method === "GET" && req.url === "/profile")
    return getProfile(req,res)
  else {
    res.writeHead(404,{"Content-Type": "application/json"})
    res.end(JSON.stringify({error: "Route not found"}))
  }
}

export default profileRoutes;