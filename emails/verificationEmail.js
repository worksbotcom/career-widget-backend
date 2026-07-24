module.exports = (companyName, companyLogo, verificationLink) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body{
                font-family:Arial,sans-serif;
                background:#f4f4f4;
                padding:30px;
            }

            .container{
                max-width:600px;
                margin:auto;
                background:#fff;
                padding:30px;
                border-radius:8px;
            }

            .btn{
                display:inline-block;
                margin-top:20px;
                padding:12px 20px;
                background:#2563eb;
                color:#000;
                text-decoration:none;
                border-radius:5px;
            }
        </style>
    </head>

    <body>

    <div class="container">


        ${
            companyLogo
                ? `<img src="${companyLogo}" alt="${companyName} Logo" class="logo" />`
                : ""
        }

        <h2>Welcome ${companyName}</h2>

        <p>
        Thank you for registering on Career Widget SaaS Platform.
        </p>

        <p>Please verify your email.</p>

        <a class="btn" href="${verificationLink}">
            Verify Email
        </a>

        <p>
        This link expires in 24 hours.
        </p>

    </div>

    </body>
    </html>
    `;
};