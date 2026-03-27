import jwt from "jsonwebtoken"


export const generateToken = (userId, res) =>{
    
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, 
        httpOnly:true, // prevent XSS attacks cross-site scripting atacks
        sameSite:"strict", // CSRF attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !== "development"
    });

    return token;
}

export const hitApi = async(req, res, next) =>{
    console.log("Api : hit ");
    next();
}
export const debugGetId = () =>{
    console.log("Api Hit.. ");
    return "69761d5a68931afe6eecaf82";
}
export const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSuccessResponse = ({message = "Operation successful", data = null, meta = null}) => {
    return{
        success: true,
        message:message,
        data:data,
        meta:meta,
        error:null,
    }
}
export const getErrorResponse = ({message = "An unexpected error occurred", error, code="INTERNAL_SERVER_ERROR", logError=false}) =>{
    // Only show technical details if we are in Dev mode
    if (logError || (error && !error.statusCode) || (error && error.statusCode >= 500)) {
        console.error(`[CRITICAL API ERROR] Code: ${code} | Message: ${message}`, error);
    }
    
    const isDev = process.env.NODE_ENV === "development";
    return {
        success: false,
        message: message, 
        data:null,
        error: isDev ? {
            message: error?.message || "No error message provided", 
            stack: error?.stack,
            code: error?.code || code
        }
        : { code: code } 
    }
}
