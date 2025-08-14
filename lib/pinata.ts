"server only";

import { PinataSDK } from "pinata";


export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_API_JWT}`,
  pinataGateway: `${process.env.PINATA_GATEWAY_URL}`
})