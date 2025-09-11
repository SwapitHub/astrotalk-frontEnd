import React, { useState } from "react";

const AstrologerReview = ({ astrologerData, renderStars}) => {
      const [onchangeTabbing, setOnchangeTabbing] = useState("Most_helpful");
      
    
  return (
    <div className="similar_consultants_section">
      <div className="header_similar_consultants">
        <h2 className="check_similar_text">Check Similar Consultants</h2>
        <i _ngcontent-serverapp-c96="" className="fa fa-info-circle"></i>
      </div>
      <div className="reviews-similiar-conslt-outer">
        <div className="reviews-similiar-conslt-inner">
          <h2 className="review-heading">User Reviews</h2>
          <div className="sort-filter-rating">
            <div className="sort-left">
              <h6> Sort By</h6>
            </div>
            <div className="sort-right">
              <div className="sort-radio">
                <input
                  type="radio"
                  name="sort"
                  checked={onchangeTabbing === "Most_helpful"}
                  id="helpful_reviews "
                  onChange={() => {
                    setOnchangeTabbing("Most_helpful");
                  }}
                />
                <label for="helpful_reviews">Most helpful</label>
              </div>
              <div className="sort-radio">
                <input
                  type="radio"
                  name="sort"
                  checked={onchangeTabbing === "Most_Recent"}
                  id="recent_reviews"
                  onChange={() => {
                    setOnchangeTabbing("Most_Recent");
                  }}
                />
                <label for="recent_reviews">Most Recent</label>
              </div>
            </div>
          </div>
          
          {onchangeTabbing == "Most_helpful" && (
            <div className="similar-conslt-reviews-sec">
              {astrologerData?.reviews?.slice(0, 50).map((item) => {
                
                return (
                  <>
                    <div className="single-review">
                      <div className="profile-stars-outer">
                      <div className="profile-image-name">
                        <div className="picture_profile">
                          <img src="" alt="" />
                        </div>
                        <div className="name-text">
                          <span>{item.userName}</span>
                        </div>
                      </div>
                      <div className="rating-stars">
                        <ul class="stars">
                          <li>{renderStars(item?.rating)}</li>
                        </ul>
                      </div>
                      </div>
                      <div className="review-content">
                        <p>{item.review}</p>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
          {onchangeTabbing == "Most_Recent" && (
            <div className="similar-conslt-reviews-sec">
              {astrologerData?.reviews.slice(0, 50).map((item) => {
                return (
                  <>
                    <div className="single-review">
                      <div className="profile-stars-outer">
                      <div className="profile-image-name">
                        <div className="picture_profile">
                          <img src="" alt="" />
                        </div>
                        <div className="name-text">
                          <span>{item.userName}</span>
                        </div>
                      </div>
                      <div className="rating-stars">
                        <ul class="stars">
                          <li>{renderStars(item?.rating)}</li>
                        </ul>
                      </div>
                      </div>
                      {/* <div className="review-content">
                                <p>{item.review}</p>
                              </div> */}
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AstrologerReview;
