import jwt from "jsonwebtoken"

export const genToken = async (userId) => {
   try {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return null;
    }
    
    let token = await jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn:"7d"})
    return token
   } catch (error) {
     console.error("User token generation error:", error);
     return null;
   }
}

export const genToken1 = async (email) => {
   try {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return null;
    }
    
    let token = await jwt.sign({email} , process.env.JWT_SECRET , {expiresIn:"7d"})
    return token
   } catch (error) {
     console.error("Admin token generation error:", error);
     return null;
   }
}
