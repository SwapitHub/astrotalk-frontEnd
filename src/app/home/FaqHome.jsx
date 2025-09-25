"use client";
import React, { useState } from "react";
import SlideToggle from "../component/SlideToggle";

const FaqHome = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Q1. How can I consult an astrologer on Astrowb?",
      answer:
        " You can choose your preferred astrologer from our verified list and connect instantly through chat or call.",
    },
    {
      id: 2,
      question: "Q2. Are the astrologers on your platform certified?",
      answer:
        " Yes, all our astrologers are carefully verified and have years of professional experience in astrology, tarot, numerology, or Vastu.",
    },
    {
      id: 3,
      question: "Q3. What kind of questions can I ask during a consultation?",
      answer: " You can ask about love, marriage, career, finances, health, education, family, or any area of life where you seek clarity.",
    },
     {
      id: 4,
      question: "Q4. Will my conversation remain private?",
      answer: "  Absolutely. We maintain 100% confidentiality for all chats, calls, and reports shared on our platform.",
    },
     {
      id: 5,
      question: "Q5. Can I get a Kundli or horoscope report?",
      answer: "  Yes, our astrologers provide detailed Kundli analysis and customized reports with remedies and future predictions.",
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
