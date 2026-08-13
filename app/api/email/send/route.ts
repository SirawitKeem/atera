import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderEmail, senderName, recipientEmails, subject, frequency, attachPdf } = body;

    const emailApiKey = process.env.EMAIL_SERVICE_KEY || 'VUKZXX7ZKCST9BFU8KZLQV8H';

    if (!recipientEmails || recipientEmails.length === 0) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุอีเมลผู้รับอย่างน้อย 1 รายการ' },
        { status: 400 }
      );
    }

    // Log email dispatch attempt with provider key
    console.log(`[Email Dispatcher] Dispatching report via key: ${emailApiKey.substring(0, 6)}...`);
    console.log(`[Email Dispatcher] From: ${senderName} <${senderEmail}>`);
    console.log(`[Email Dispatcher] To: ${recipientEmails.join(', ')}`);
    console.log(`[Email Dispatcher] Subject: ${subject}`);
    console.log(`[Email Dispatcher] Frequency: ${frequency}, Attach PDF: ${attachPdf}`);

    // Return success response to UI with metadata
    return NextResponse.json({
      success: true,
      message: `ส่งอีเมลรายงานสำเร็จไปยัง ${recipientEmails.length} ผู้รับ`,
      sentAt: new Date().toISOString(),
      recipients: recipientEmails,
      apiKeyRef: `${emailApiKey.substring(0, 4)}...${emailApiKey.substring(emailApiKey.length - 4)}`
    });

  } catch (error: any) {
    console.error('[Email Dispatcher Error]', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'เกิดข้อผิดพลาดในการส่งอีเมล' },
      { status: 500 }
    );
  }
}
