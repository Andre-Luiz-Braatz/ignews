import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

export default async function handle(req: NextApiRequest, res: NextApiResponse){
  console.log('kkkk');
  
  if(req.method === "POST"){

    const session = await getSession({req})
    console.log(" session =>>>",session);
    

    const stripeCustumer = await stripe.customers.create({
      email: session.user.email,
      // metadata
    })
    console.log("stripeCustumer: ",stripeCustumer);
    

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustumer.id,
      payment_method_types: ["card"],
      billing_address_collection: 'required',
      line_items: [{price: 'price_1LfUqLJLpOWMBlfhGletuElC',quantity: 1}],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })
    return res.status(200).json({sessionId: stripeCheckoutSession.id})
  }else{
    res.setHeader("Allow","POST");
    res.status(405).end("Method not allowed");
  }
}