const AdminLog = require("../models/SuperAdminLog");

const superadminLogger = async ({
    admin,
    action,
    company,
    details = {}
}) => {

    try {

        await AdminLog.create({

            adminId: admin.id,

            adminEmail: admin.email,

            action,

            companyId: company?.companyId,

            companyName: company?.companyName,

            details

        });

    } catch (error) {

        console.log("Audit Log Error:", error.message);

    }

};

module.exports = superadminLogger;