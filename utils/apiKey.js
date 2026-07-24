const crypto = require("crypto");

module.exports = () => {

    return "cw_live_" + crypto.randomBytes(20).toString("hex");

}