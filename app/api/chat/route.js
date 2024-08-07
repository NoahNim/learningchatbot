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
      try {
        const openai = new OpenAI();
        const data = await req.json();
        console.log(data);
    
        const completion = openai.chat.completions.create({
            messages: [
                {"role": "system", "content": systemPrompt},
                data[1]
              ],
            model: "gpt-4o-mini",
          });
    
        return NextResponse.json({message: completion.choices[0].message.content}, {status: 200});
    } catch(error) {
      if (error instanceof Error) {
        console.log(error?.message)
        return new Response(error.message, { status: 500 });
      }
  
      return new Response("Internal Server Error", { status: 500 });
    }


};