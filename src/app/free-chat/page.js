"use client";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import React from "react";

const FreeChat = () => {
  return (
    <div className="container">
      <div className="free-chat-main">
        <Link href="/chat-with-astrologecr">Explore More</Link>

        <div className="free-chat">
          <div className="img">
            <img
              src="https://d1gcna0o0ldu5v.cloudfront.net/fit-in/320x410/assets/images/login_banner.webp"
              alt=""
            />
          </div>
          <h1>
            Congratulations you got a <span> Free Chat!</span>{" "}
          </h1>
          <Link href="/free-chat/start">start free chatting</Link>
        </div>
      </div>
    </div>
  );
};

export default FreeChat;
