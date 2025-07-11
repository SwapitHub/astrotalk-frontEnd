import Payment from "./Payment"

const PaymentServer = ({searchParams}) => {
    const pmtId = searchParams.pmt
    
  return (
    <Payment pmtId={pmtId}/>
  )
}

export default PaymentServer