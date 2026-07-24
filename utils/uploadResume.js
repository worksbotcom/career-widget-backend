const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadResumeToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject(new Error("No file buffer provided"));
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "career-widget/resumes",
                resource_type: "raw",
                use_filename: true,
                unique_filename: false
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

module.exports = uploadResumeToCloudinary;
