import Link from "next/link";
import React from "react";

const DetailAstrologyBlog = ({ blogsDetailData }) => {
  return (
  <div className="blogs-detail-outer">
    <div className="container">
      <Link href="/astrology-blog">Go Back</Link>
      <div className="blogs-detail">
        <div className="blog-featured-img">
        <img src={blogsDetailData?.coverImage} alt={blogsDetailData?.name} />
        </div>
        <div className="name-date">
          <p>{blogsDetailData?.title}</p>
          {new Date(blogsDetailData?.createdAt).toLocaleString()}
        </div>
        <div className="blog-post-content">
          <div dangerouslySetInnerHTML={{ __html: blogsDetailData?.content }} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default DetailAstrologyBlog;
