import Image from "next/image";
import Link from "next/link";
import React from "react";

const DetailAstrologyBlog = ({ blogsDetailData }) => {
  return (
    <div className="blogs-detail-outer">
      <div className="container">
        <div className="blogs-detail">
          <Link href="/astrology-blog">Go Back</Link>
          <div className="blog-featured-img">
            <Image
              width={100}
              height={100}
              src={
                blogsDetailData?.coverImage
                  ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                    blogsDetailData?.coverImage
                  : "/user-icon-image.png"
              }
              alt={blogsDetailData?.name}
            />
          </div>
          <div className="name-date">
            <p>{blogsDetailData?.title}</p>
            <p>{blogsDetailData?.author}</p>

            {new Date(blogsDetailData?.createdAt).toLocaleString()}
          </div>
          <div className="blog-post-content">
            <div
              dangerouslySetInnerHTML={{ __html: blogsDetailData?.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAstrologyBlog;
