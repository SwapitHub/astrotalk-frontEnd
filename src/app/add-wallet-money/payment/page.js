import Payment from "./Payment";

const PaymentServer = async ({ searchParams }) => {
  const params = await searchParams;
  const pmtId = params.pmt;

  return <Payment pmtId={pmtId} />;
};

export default PaymentServer;
