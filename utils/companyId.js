const crypto = require("crypto");

module.exports = () => {

    return "COMP_" + crypto.randomBytes(3).toString("hex").toUpperCase();

}