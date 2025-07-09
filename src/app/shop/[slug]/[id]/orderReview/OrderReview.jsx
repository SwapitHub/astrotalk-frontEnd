import React from "react";

const OrderReview = () => {
  return (
    <>
      <div className="breadcrumb-outer">
        <div className="container">
          <div className="breadcrumb">
            <ul>
              <li>
                <a href="/chat-with-astrologer"></a>
                <span className="text">Payment Information</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section className="payment-checkout-outer">
        <div className="container">
          <div className="payment-checkout-inner">
            <div className="summary-heading">
              <h3>Payment Information</h3>
            </div>
            <div className="card-body">
              <div className="cart_table table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h6>Dhan Yog Bracelet</h6>
                      </td>
                      <td>
                        <p> ₹ 582</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-body-sec">
                <div className="card-body-left">
                  <div className="order-summary">
                    <div className="order-summary-content">
                      <div className="single-summary">
                        <div className="single-summary-left">
                          <p>Dhan Yog Bracelet </p>
                        </div>
                        <div className="single-summary-right">
                          <span> ₹ 581.55</span>
                        </div>
                      </div>
                    </div>
                    <div className="summary-amount">
                      <div className="single-summary">
                        <div className="single-summary-left">
                          <p>Total Amount </p>
                        </div>
                        <div className="single-summary-right">
                          <span> ₹ 581.55</span>
                        </div>
                      </div>
                      <div className="single-summary">
                        <div className="single-summary-left">
                          <p>GST @3% </p>
                        </div>
                        <div className="single-summary-right">
                          <span> ₹ 17.45</span>
                        </div>
                      </div>
                      <div className="single-summary total-amount">
                        <div className="single-summary-left">
                          <p>Total Payable Amount</p>
                        </div>
                        <div className="single-summary-right">
                          <span>₹ 599.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body-right">
                  <div className="order_detail">
                    <div className="order-listing">
                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/862d3be7-4a92-41ef-994c-67370fa5b3b2.png" alt="" />
                        <div className="payment-method-text">Credit/Debit Card</div>
                      </div>
                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/dec84d5c-4223-4fcc-b70b-57755ec49cb2.png" alt="" />
                        <div className="payment-method-text">PhonePe</div>
                      </div>
                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/937d2e28-8347-4cdf-8ad5-daf772c03ed6.png" alt="" />
                        <div className="payment-method-text">GPay</div>
                      </div>
                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/99079185-3b3e-4aa3-85b0-9bb015d68fcb.png" alt="" />
                        <div className="payment-method-text">Paytm</div>
                      </div>
                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/ddaf5cfb-b61c-4566-a3f7-f6ba8fbe6fcd.png" alt="" />
                        <div className="payment-method-text">BHIM</div>
                      </div>

                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/8fb0a403-51ce-4b15-a21c-97d73a888b79.png" alt="" />
                        <div className="payment-method-text">Other wallets</div>
                      </div>

                      <div className="single-payment-method">
                        <img src="https://aws.astrotalk.com/images/b5badc91-a8bc-45e7-9a94-b1fc10ec3610.png" alt="" />
                        <div className="payment-method-text">Paytm</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderReview;
