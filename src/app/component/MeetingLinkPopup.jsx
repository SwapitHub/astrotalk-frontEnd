import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const MeetingLinkPopup = ({ setLiveLinkPopUp, liveLink }) => {
  const [copied, setCopied] = useState(false);

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/call/${liveLink}`;

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed"; // avoid scrolling to bottom
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      // Clear the "Copied!" indicator after 1.6s
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("Copy failed", err);
      // Optionally notify user of failure
    }
  };

  return (
    <div className="meeting-link">
      <div className="close" onClick={() => setLiveLinkPopUp(false)}>
        X
      </div>
      <div className="meeting-popup-content">
        <h3>Here's your joining info</h3>
        <p>
          Send this to people you want to meet with. Be sure to save it so you
          can use it later, too.
        </p>
      </div>
      <div className="meeting-link-copy-outer">
        <div className="link-url">{url}</div>

        <span
          className="copy-icon"
          onClick={() => copyToClipboard(url)}
          role="button"
          aria-label="Copy meeting link"
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaRegCopy />
          {copied ? (
            <small style={{ color: "green" }}>Copied!</small>
          ) : (
            <small>Copy</small>
          )}
        </span>
      </div>
    </div>
  );
};

export default MeetingLinkPopup;
