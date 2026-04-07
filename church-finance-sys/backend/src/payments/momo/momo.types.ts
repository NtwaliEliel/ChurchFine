export type MomoRequestToPayBody = {
  amount: string;
  currency: string;
  externalId: string;
  payer: { partyIdType: 'MSISDN'; partyId: string };
  payerMessage?: string;
  payeeNote?: string;
};

