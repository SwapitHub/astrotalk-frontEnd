import Link from "next/link";
import React from "react";

const HeaderDashNotification = () => {
  return (
    <ul className="notification-dropdown onhover-show-div">
      <li>
        Notification{" "}
        <span className="badge" id="notification-badge">
          4
        </span>
      </li>
      <li>
        <div className="media">
          <div className="media-body">
            <h6 className="mt-0 txt-success">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-message-square download-color font-success"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <Link href="#" className="txt-success">
                Task Completed
              </Link>
              <small>17 Feb 25 , 08:05:36</small>
            </h6>

            <Link href="#">
              {" "}
              <p className="mb-0">Gemstone sheet has been generated.</p>
            </Link>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default HeaderDashNotification;
