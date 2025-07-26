import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface EmailRequest {
  to: string
  subject: string
  content: string
  prospectName: string
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, prospectName }: EmailRequest = await request.json()

    console.log('Email API called with:', { to, subject: subject.substring(0, 50), prospectName })

    if (!to || !subject || !content) {
      console.error('Missing required fields:', { to, subject: !!subject, content: !!content })
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, content' },
        { status: 400 }
      )
    }

    // Check if email credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured')
      return NextResponse.json(
        { 
          error: 'Email server not configured',
          details: 'SMTP_USER and SMTP_PASS must be set in environment variables'
        },
        { status: 500 }
      )
    }

    // SMTP configuration with proper SSL handling
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465, // true for 465 (SSL), false for other ports (STARTTLS)
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
      // Additional options for better compatibility
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false
      }
    })

    // Verify connection configuration
    console.log('Verifying SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection verified successfully')

    // Send email
    console.log(`Sending email to ${to}...`)
    const info = await transporter.sendMail({
      from: `"YOUR LEGEND Scouting Team" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      text: content,
      html: content.replace(/\n/g, '<br>'), // Simple HTML conversion
    })

    console.log(`Email sent successfully to ${prospectName} (${to}): ${info.messageId}`)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      recipient: to,
    })

  } catch (error) {
    console.error('Detailed error sending email:', error)
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    
    let errorMessage = 'Unknown error'
    let errorDetails = 'No additional details available'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
      
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check for specific error types
      if (error.message.includes('authentication') || error.message.includes('auth')) {
        errorMessage = 'Email authentication failed'
        errorDetails = 'Invalid SMTP credentials. Please check SMTP_USER and SMTP_PASS.'
        statusCode = 401
      } else if (error.message.includes('connection') || error.message.includes('connect')) {
        errorMessage = 'Could not connect to email server'
        errorDetails = 'Please check SMTP_HOST and SMTP_PORT settings.'
        statusCode = 503
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Email server not found'
        errorDetails = `Could not resolve hostname: ${process.env.SMTP_HOST}`
        statusCode = 503
      }
    } else {
      console.error('Non-Error object thrown:', JSON.stringify(error, null, 2))
      errorMessage = 'Unexpected error type'
      errorDetails = JSON.stringify(error)
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? 'SET' : 'NOT SET',
          pass: process.env.SMTP_PASS ? 'SET' : 'NOT SET'
        }
      },
      { status: statusCode }
    )
  }
}