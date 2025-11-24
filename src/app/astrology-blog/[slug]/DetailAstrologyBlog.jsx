import Image from "next/image";
import Link from "next/link";
import React from "react";

const DetailAstrologyBlog = ({ blogsDetailData }) => {
  console.log(blogsDetailData);
  
  return (
    <div className="blogs-detail-outer">
      <div className="container">
        <div className="blogs-detail">
          <div className="blogs-detail-top">
            <Link className="blog-back" href="/astrology-blog">Go Back</Link>
            <div className="name-date">
              <h1>{blogsDetailData?.title}</h1>
              <p className="author">{blogsDetailData?.author}</p>

              <p className="date">{new Date(blogsDetailData?.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="blog-featured-img">
            <Image
              width={800}
              height={450}
              src={
                blogsDetailData?.coverImage
                  ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                    blogsDetailData?.coverImage
                  : "/user-icon-image.png"
              }
              alt={blogsDetailData?.name}
            />
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
