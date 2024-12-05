import { getOffers } from "./providers";


export default async function (params: any, context: any) {
  const { amount } = params;
  return getOffers(amount);
}
