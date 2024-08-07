import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Welcome to Meowtime Customer Support!
I'm here to help you with any questions or issues related to Meowtime, the app that lets your feline friends video chat with other cats with just one press of a button. Whether you need assistance with app features, troubleshooting, or anything else, I'm here to make sure your experience is purr-fect!

Here’s how I can assist you:

    Account & Login Issues: Help with creating an account, logging in, or managing your profile.
    Video Chat Troubles: Solutions for any problems with initiating or participating in video chats.
    App Features: Information on how to use various features of the app to enhance your cat’s social experience.
    Subscription & Payments: Assistance with subscription plans, payments, or billing questions.
    Technical Support: Troubleshooting for any bugs or issues you might be experiencing with the app.
    General Inquiries: Answering any other questions you may have about Meowtime and how it works.

Please type your question or describe your issue, and I’ll do my best to assist you swiftly. For a faster resolution, include as much detail as possible about the issue you’re experiencing. If you’re ready to start, just let me know!

Paws up for a great Meowtime experience!`

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  const completion = await openai.chat.completions.create({
      messages: [
          {
              role: 'system',
              content: systemPrompt,
          },
          ...data,
      ],
      model: 'gpt-4o-mini',
      stream: true
  })

  const stream = new ReadableStream({
      async start(controller) {
          const encoder = new TextEncoder()
          try {
              for await (const chunk of completion) {
                  const content = chunk.choices[0]?.delta?.content;
                  if (content) {
                      const text = encoder.encode(content);
                      controller.enqueue(text);

                  }
              }
          } catch(err) {
              controller.error(err)
          } finally {
              controller.close(``)
          }
      },
  })

  return new NextResponse(stream);
}