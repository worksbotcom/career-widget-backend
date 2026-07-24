const Company = require("../models/Company");
const Job = require("../models/Job");
const Department = require("../models/Department");
const Location = require("../models/Location");
const Application = require("../models/Application");
const TeamMember = require("../models/teamMember");


// GET COMPANY DASHBOARD

exports.getDashboardStats = async (req, res) => {

    try {

        const companyId = req.company.id;

        const [

            totalJobs,

            activeJobs,

            draftJobs,

            departments,

            locations,

            totalApplications,

            teamMembers

        ] = await Promise.all([

            Job.countDocuments({

                companyId

            }),

            Job.countDocuments({

                companyId,

                status: "Published"

            }),

            Job.countDocuments({

                companyId,

                status: "Draft"

            }),

            Department.countDocuments({

                companyId

            }),

            Location.countDocuments({

                companyId

            }),

            Application.countDocuments({

                companyId

            }),

            TeamMember.countDocuments({

                companyId

            })

        ]);



        const recentJobs = await Job.find({

            companyId

        })

        .sort({

            createdAt: -1

        })

        .limit(5)

        .select(

            "title status createdAt"
        );



        const recentApplications = await Application.find({

            companyId

        })

        .sort({

            createdAt: -1

        })

        .limit(5)

        .populate(

            "jobId",

            "title"

        )

        .select(

            "candidateName email status createdAt jobId"
        );



        res.status(200).json({

            success: true,

            data: {

                totalJobs,

                activeJobs,

                draftJobs,

                departments,

                locations,

                totalApplications,

                teamMembers,

                recentJobs,

                recentApplications

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to load dashboard."

        });

    }

};