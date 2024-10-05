const generate2FAEmailHtml = (verificationCode: string, currentYear: number) => `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OTP Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333333;
            }
        
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
        
            .header {
              background-color: hsl(262.1 83.3% 57.8%);
              color: #ffffff;
              padding: 20px;
              text-align: center;
              font-size: 24px;
            }
        
            .content {
              padding: 30px;
            }
        
            .content p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
        
            .otp {
              display: inline-block;
              font-size: 28px;
              color: hsl(262.1 83.3% 57.8%);
              font-weight: bold;
              letter-spacing: 4px;
              background-color: #f0f0f0;
              padding: 15px 25px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
        
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #777777;
              background-color: #f9f9f9;
            }
        
            .footer p {
              margin: 0;
            }
        
            @media only screen and (max-width: 600px) {
              .container {
                padding: 20px;
                width: 100%;
              }
        
              .content {
                padding: 20px;
              }
        
              .otp {
                font-size: 24px;
              }
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <div class="header">
              Your OTP Code
            </div>
            <div class="content">
              <p>Dear User,</p>
              <p>Your 2-Factor Authentication code for login is:</p>
              <div class="otp">${verificationCode}</div>
              <p><strong>Note:</strong> This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br> The Linktide Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${currentYear} Linktide. All rights reserved.</p>
            </div>
          </div>
        </body>
        
        </html>`

const generateVerificationEmailHtml = (verificationCode: string, currentYear: number) => `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333333;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background-color: hsl(262.1 83.3% 57.8%);
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }

    .content {
      padding: 30px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .otp {
      display: inline-block;
      font-size: 28px;
      color: hsl(262.1 83.3% 57.8%);
      font-weight: bold;
      letter-spacing: 4px;
      background-color: #f0f0f0;
      padding: 15px 25px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      background-color: #f9f9f9;
    }

    .footer p {
      margin: 0;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: #ffffff;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
    }

    @media only screen and (max-width: 600px) {
      .container {
        padding: 20px;
        width: 100%;
      }

      .content {
        padding: 20px;
      }

      .otp {
        font-size: 24px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      Your OTP Code
    </div>
    <div class="content">
      <p>Dear User,</p>
      <p>We received a request to verify your email address. Please use the following One-Time Password (OTP) to complete the process:</p>
      <div class="otp">${verificationCode}</div>
      <p><strong>Note:</strong> This OTP is valid for one hour. If you did not request this, please ignore this email.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br> The Linktide Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${currentYear} Linktide. All rights reserved.</p>
    </div>
  </div>
</body>

</html>`;
const generateResetEmailHtml = (verificationCode: string, currentYear: number) => `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333333;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
    
        .header {
          background-color: hsl(262.1 83.3% 57.8%);
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 24px;
        }
    
        .content {
          padding: 30px;
        }
    
        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
    
        .otp {
          display: inline-block;
          font-size: 28px;
          color: hsl(262.1 83.3% 57.8%);
          font-weight: bold;
          letter-spacing: 4px;
          background-color: #f0f0f0;
          padding: 15px 25px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
    
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #777777;
          background-color: #f9f9f9;
        }
    
        .footer p {
          margin: 0;
        }
    
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: #ffffff;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        }
    
        @media only screen and (max-width: 600px) {
          .container {
            padding: 20px;
            width: 100%;
          }
    
          .content {
            padding: 20px;
          }
    
          .otp {
            font-size: 24px;
          }
        }
      </style>
    </head>
    
    <body>
      <div class="container">
        <div class="header">
          Your OTP Code
        </div>
        <div class="content">
          <p>Dear User,</p>
          <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to complete the process:</p>
          <div class="otp">${verificationCode}</div>
          <p><strong>Note:</strong> This OTP is valid for one hour. If you did not request a password reset, please ignore this email.</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br> The Linktide Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${currentYear} Linktide. All rights reserved.</p>
        </div>
      </div>
    </body>
    
    </html>`;
    const generateNewEmailVerificationHtml = (verificationLink: string, currentYear: number) => `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333333;
            }
        
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
        
            .header {
              background-color: hsl(262.1 83.3% 57.8%);
              color: #ffffff;
              padding: 20px;
              text-align: center;
              font-size: 24px;
            }
        
            .content {
              padding: 30px;
            }
        
            .content p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
        
            .button {
              display: inline-block;
              padding: 15px 25px;
              font-size: 18px;
              color: #ffffff;
              background-color: hsl(262.1 83.3% 57.8%);
              text-decoration: none;
              border-radius: 5px;
              margin-bottom: 20px;
              transition: background-color 0.3s ease;
            }
        
            .button:hover {
              background-color: hsl(262.1 83.3% 47.8%);
            }
        
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #777777;
              background-color: #f9f9f9;
            }
        
            .footer p {
              margin: 0;
            }
        
            @media only screen and (max-width: 600px) {
              .container {
                padding: 20px;
                width: 100%;
              }
        
              .content {
                padding: 20px;
              }
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <div class="header">
              Confirm Your New Email
            </div>
            <div class="content">
              <p>Dear User,</p>
              <p>To complete the update of your email address, please click the button below to verify your new email:</p>
              <a href="${verificationLink}" class="button">Verify New Email</a>
              <p><strong>Note:</strong> Your email will only be changed once it's confirmed. This verification link will expire in 1 hour.</p>
              <p>If you did not request this email change, please ignore this email.</p>
              <p>Best regards,<br> The Linktide Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${currentYear} Linktide. All rights reserved.</p>
            </div>
          </div>
        </body>
        
        </html>`;

export{
    generateVerificationEmailHtml,
    generate2FAEmailHtml,
    generateResetEmailHtml,
    generateNewEmailVerificationHtml
}