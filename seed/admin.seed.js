require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const Admin = require("../models/SuperAdmin");

const seedAdmin = async () => {
    try {

        await connectDB();

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        const admin = await Admin.findOne({
            email: process.env.ADMIN_EMAIL
        });

        if (!admin) {

            await Admin.create({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword
            });

            console.log("Admin created successfully.");

        } else {

            admin.name = process.env.ADMIN_NAME;
            admin.password = hashedPassword;

            await admin.save();

            console.log("Admin updated successfully.");

        }

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
};

seedAdmin();