import { NextRequest, NextResponse } from 'next/server';

// Mailchimp API configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., 'us1', 'us2', etc.

// Email notification configuration
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'easteregg@overdriveoriginals.com';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

interface SubscriptionData {
  email: string;
  instagram?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionData = await request.json();
    const { email, instagram } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if required environment variables are set
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
      console.error('Missing Mailchimp configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Add subscriber to Mailchimp
    const mailchimpUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
    
    const mailchimpData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        ...(instagram && { INSTAGRAM: instagram })
      },
      tags: ['Race Support', 'Website Signup']
    };

    const mailchimpResponse = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    const mailchimpResult = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      // Handle duplicate email case
      if (mailchimpResult.title === 'Member Exists') {
        return NextResponse.json(
          { message: 'You are already subscribed to our list!' },
          { status: 200 }
        );
      }
      
      console.error('Mailchimp error:', mailchimpResult);
      return NextResponse.json(
        { error: 'Failed to subscribe to mailing list' },
        { status: 500 }
      );
    }

    // Send notification email
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        await sendNotificationEmail(email, instagram);
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the request if email notification fails
      }
    }

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to the Race Support insider list!',
        subscriber: {
          email: mailchimpResult.email_address,
          status: mailchimpResult.status
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendNotificationEmail(email: string, instagram?: string) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransporter({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const instagramText = instagram ? `Instagram: @${instagram}` : 'No Instagram handle provided';

  const mailOptions = {
    from: SMTP_USER,
    to: NOTIFICATION_EMAIL,
    subject: '🏎️ New Race Support Subscriber - Overdrive Originals',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">🏎️ New Race Support Subscriber!</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Subscriber Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>${instagramText}</strong></p>
          <p><strong>Source:</strong> Race Support Page</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
          <p style="margin: 0;"><strong>Action Required:</strong> New subscriber has been added to the Race Support Mailchimp list and tagged appropriately.</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #666; font-size: 14px;">
          This notification was sent automatically from the Overdrive Originals website.<br>
          <a href="https://overdriveoriginals.com/race-support" style="color: #06b6d4;">View Race Support Page</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
