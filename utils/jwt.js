const jwt = require("jsonwebtoken");

exports.generateAccessToken = (company) => {

    return jwt.sign(

        {
            id: company._id,
            companyId: company.companyId,
            email: company.email
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }

    );

};

exports.generateRefreshToken = (company) => {

    return jwt.sign(

        {
            id: company._id
        },

        process.env.JWT_REFRESH_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }

    );

};