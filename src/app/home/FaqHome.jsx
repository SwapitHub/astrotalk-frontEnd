import React, { useState } from "react";

const FaqHome = () => {
  const [toggleFaq, setToggleFaq] = useState();
  return (
    <>
      <section className="faq_section section-spacing">
        <div className="container">
          <div className="home-heading">
            <h2>Faqs</h2>
          </div>
          <div className="faq-section">
            <div className="faq-item" data-id="q1">
              <div className="faq-row">
                <div className="faq-question" onClick={() => setToggleFaq(toggleFaq === 1 ? null : 1)}>
                  What is your return policy?
                </div>
                <div className="icon"></div>
              </div>
              <div className={`faq-answer ${toggleFaq == 1 ? "active" : ""}`}>
                We offer a 30-day return window with full refund, no questions
                asked.
              </div>
            </div>

            <div className="faq-item" data-id="q2">
              <div className="faq-row">
                <div className="faq-question" onClick={() => setToggleFaq(toggleFaq === 2 ? null : 2)}>How long does shipping take?</div>
                <div className="icon"></div>
              </div>
              <div className={`faq-answer ${toggleFaq == 2 ? "active" : ""}`}>
                Standard shipping takes 5–7 business days. Express options are
                available.
              </div>
            </div>

            <div className="faq-item" data-id="q3">
              <div className="faq-row">
                <div className="faq-question" onClick={() => setToggleFaq(toggleFaq === 3 ? null : 3)}>Do you ship internationally?</div>
                <div className="icon"></div>
              </div>
              <div className={`faq-answer ${toggleFaq == 3 ? "active" : ""}`}>
                Yes, we ship worldwide! Rates and times vary by region.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqHome;
