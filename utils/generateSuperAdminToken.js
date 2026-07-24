const jwt = require("jsonwebtoken");

const generateAdminToken = (superadmin) => {

    return jwt.sign(
        {
            id: superadmin._id,
            email: superadmin.email,
            role: superadmin.role
        },
        process.env.ADMIN_JWT_SECRET,
        {
            expiresIn: process.env.ADMIN_JWT_EXPIRES_IN
        }
    );

};

module.exports = generateAdminToken;