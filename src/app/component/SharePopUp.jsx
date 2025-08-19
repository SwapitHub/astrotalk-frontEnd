"use client";
import React, { useState } from "react";
import { LuMessageCircleMore } from "react-icons/lu";
import { BsCopy } from "react-icons/bs";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
const SharePopUp = ({
  setShareOpenPopup,
  showUserIdToAst,
  astrologerIdToAst,
}) => {
  const [copied, setCopied] = useState(false);
  const copyUrl = () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/chat-with-astrologer/user/${showUserIdToAst}/?user=order-history&astrologerIdToAst=${astrologerIdToAst}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="sharePopUp">
      <h3>Share with your friends</h3>
      <div className="cross" onClick={() => setShareOpenPopup(false)}>
        X
      </div>
      <div className="message-icon">
        <span>
          <LuMessageCircleMore />
        </span>
      </div>
      <div className="copy">
        <Link
          href={`/chat-with-astrologer/user/${showUserIdToAst}/?user=order-history&astrologerIdToAst=${astrologerIdToAst}`}
          className="text-blue-600 underline"
          onClick={()=>{setShareOpenPopup(false)}}
        >
          {process.env.NEXT_PUBLIC_BASE_URL}/chat-with-astrologer/user/
          {showUserIdToAst}/?user=order-history&astrologerIdToAst=
          {astrologerIdToAst}
        </Link>
        <div className="Clipboard-icon-outer">
          <div className="Clipboard-icon">
            <BsCopy onClick={copyUrl} />
          </div>
          <div className="clipboard-text">Copy to Clipboard</div>
          {copied && <span className="text-green-500 text-sm">Copied!</span>}
        </div>
      </div>
      <div className="information">
        <Link href="https://www.whatsapp.com/">
          <FaWhatsapp />
        </Link>
        <Link href="https://www.facebook.com/">
          {" "}
          <FaFacebook />
        </Link>
        <Link href="https://in.linkedin.com/">
          {" "}
          <FaLinkedin />
        </Link>
      </div>
    </div>
  );
};

export default SharePopUp;
