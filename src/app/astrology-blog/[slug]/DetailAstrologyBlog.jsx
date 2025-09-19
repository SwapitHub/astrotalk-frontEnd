import React from "react";

const DetailAstrologyBlog = ({ blogsDetailData }) => {
  return (
    <div className="container">
      <div className="blogs-detail">
        <img src={blogsDetailData?.coverImage} alt={blogsDetailData?.name} />
        <div className="name-date">
          <p>{blogsDetailData?.title}</p>
          {new Date(blogsDetailData?.createdAt).toLocaleString()}
          <p></p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: blogsDetailData?.content }} />
      </div>
    </div>
  );
};

export default DetailAstrologyBlog;
