import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RatingPopUp = ({ userId, astrologerId, setShowRating, showUserData }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [review, setReview] = useState("");

  const submitRating = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/profile-rating`,
        {
          userId,
          astrologerId,
          userName: showUserData?.name,
          rating: selectedRating,
          review,
        }
      );
      fetchAverage();
      setShowRating(false);
    } catch {
      toast.error("Please Select Rating", {
        position: "top-right",
      });
    }
  };

  const fetchAverage = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/average-rating/${astrologerId}`
    );
    setAverageRating(res.data.averageRating);
    console.log(res);
  };

  useEffect(() => {
    fetchAverage();
  }, []);

  return (
    <div className="rating-popup">
      <div className="close-icon">
        <button
          onClick={() => {
            setShowRating(false);
          }}
        >
          X
        </button>
      </div>
      <div className="rating-popup-inner">
        <h4>Average Rating: {averageRating} ⭐</h4>
        <div className="rating-star">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setSelectedRating(n)}
              style={{
                cursor: "pointer",
                color: n <= selectedRating ? "#bd9f00" : "#b9b8b8",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div className="rating-popup-form">
          <textarea
            placeholder="Write a review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button onClick={submitRating}>Submit Rating</button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopUp;
