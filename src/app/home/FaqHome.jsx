"use client";
import React, { useState } from "react";
import SlideToggle from "../component/SlideToggle";

const FaqHome = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return window with full refund, no questions asked.",
    },
    {
      id: 2,
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5–7 business days. Express options are available. Standard shipping takes 5–7 business days. Express options are available. Standard shipping takes 5–7 business days. Express options are available.",
    },
    {
      id: 3,
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! Rates and times vary by region.",
    },
  ];

  return (
    <section className="faq_section section-spacing">
      <div className="container">
        <div className="home-heading">
          <h2>Faq's</h2>
        </div>
        <div className="faq-section">
          {faqs.map((faq) => (
            <div key={faq.id} className={`faq-item ${openFaq === faq.id ? "open" : ""}`}>
              <div
                className="faq-row"
                onClick={() =>
                  setOpenFaq(openFaq === faq.id ? null : faq.id)
                }
              >
                <div className="faq-question">{faq.question}</div>
                <div className="icon"></div>
              </div>
              <SlideToggle isOpen={openFaq === faq.id}>
                <div className="faq-answer">{faq.answer}</div>
              </SlideToggle>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqHome;
