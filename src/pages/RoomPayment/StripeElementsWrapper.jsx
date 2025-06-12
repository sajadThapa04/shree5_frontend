// StripeElementsWrapper.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import conf from "../../conf/conf";

const stripePromise = loadStripe(conf.stripe_api);

export const StripeElementsWrapper = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
