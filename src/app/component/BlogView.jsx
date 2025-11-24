import Image from "next/image";
import React from "react";

const BlogView = ({ setAddActiveStatus, withdrawDataDetail }) => {
  return (
    <div className="astro-detail-main-view">
      <span
        className="close"
        onClick={() => {
          setAddActiveStatus(false);
        }}
      >
        X
      </span>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Blog Detail</h2>

      {/* User Table */}

      <div className="profile-table">
        <div className="inner-profile-table">
          <div className="common-profile blog-img">
            <div className="name"> Image</div>
            <div className="input-outer">
              {" "}
              <Image
                width={100}
                height={100}
                src={
                  process.env.NEXT_PUBLIC_WEBSITE_URL +
                  withdrawDataDetail?.coverImage
                }
                alt="user-icon"
              />
            </div>
          </div>
          <div className="common-profile">
            <div className="name"> Author</div>
            <div className="input-outer">{withdrawDataDetail?.author}</div>
          </div>
          <div className="common-profile">
            <div className="mobile"> Title</div>
            <div className="input-outer">{withdrawDataDetail?.title}</div>
          </div>
          <div className="common-profile">
            <div className="mobile">Slug</div>
            <div className="input-outer">{withdrawDataDetail?.slug}</div>
          </div>
          <div className="common-profile">
            <div className="mobile">Short Description</div>
            <div className="input-outer">
              {withdrawDataDetail?.shortDescription}
            </div>
          </div>

          <div className="common-profile">
            <div className="date-time">Date and Time</div>
            <div className="input-outer">
              {" "}
              {withdrawDataDetail?.createdAt &&
                new Date(withdrawDataDetail?.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="common-profile">
            <div className="mobile">Full Description</div>
            <div
              className="input-outer"
              dangerouslySetInnerHTML={{ __html: withdrawDataDetail?.content }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
