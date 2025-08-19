import jwt from "jsonwebtoken";

const checkLogin = (req,res,next) => {
    try {
        const token = req.cookies.token;
        if (!token){
            return res.redirect("/admin");
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        if (!decoded){
            return res.redirect("/admin");
        }

        req.role = decoded.role;
        req.fullname = decoded.fullname;
        req.id = decoded.id;
        next();
    } catch (error) {
        throw new Error("User not login");
    }
}

export default checkLogin;