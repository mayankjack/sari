import { loadStripe, Stripe } from '@stripe/stripe-js'

// Replace with your actual Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here'

let stripePromise: Promise<Stripe | null>

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

export default getStripe
