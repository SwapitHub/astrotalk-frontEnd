import React, { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import SeminarUserForm from "../component/SeminarUserForm";
import Image from "next/image";

const SeminarBanner = ({ NewlySeminarList }) => {
  const [toggleSlideMobile, setToggleSlideMobile] = useState(false);
  console.log(NewlySeminarList);

  useEffect(() => {
    const className = "user-seminar-opened";

    if (toggleSlideMobile) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  }, [toggleSlideMobile]);

  const handleBookSeat = () => {
    console.log("kjkjkj");

    setToggleSlideMobile(true);
  };
  return (
    <section class="seminar-bannner">
      <SeminarUserForm
        setToggleSlideMobile={setToggleSlideMobile}
        NewlySeminarList_id={NewlySeminarList?._id}
      />
      <div class="container">
        <div class="seminar_wrapper">
          <div class="seminar-banner-row">
            <div class="left_col">
              <div class="content">
                <div className="new">new</div>
                <h1>
                  <span>
                    {" "}
                    <strong>2025</strong> Astrologer{" "}
                  </span>
                  Seminar
                </h1>
                <p>{NewlySeminarList?.seminar_detail}</p>
              </div>
              <div class="seminar_btn">
                <button onClick={() => handleBookSeat()}>
                  Reserve Your Spot
                </button>
              </div>
              <div class="seminar_date_location">
                <div class="row">
                  <div class="sm-dl-col">
                    <div class="icon">
                      <i class="fa-regular fa-calendar-days"></i>
                    </div>
                    <div class="text-date">
                      <SlCalender />
                      <span>{NewlySeminarList?.date_of_seminar}</span>
                    </div>
                  </div>
                  <div class="sm-dl-col">
                    <div class="icon">
                      <i class="fa-solid fa-clock"></i>
                    </div>
                    <div class="text-date">
                      <IoTimeOutline />{" "}
                      <span>{NewlySeminarList?.time_of_seminar}</span>
                    </div>
                  </div>
                  <div class="sm-dl-col">
                    <div class="icon">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="text-date">
                      <CiLocationOn />
                      <span>{NewlySeminarList?.location_seminar}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right_col">
              <div class="seminar_user_row">
                <div class="col">
                  <div class="author">
                    <div class="heading">{NewlySeminarList?.name}</div>
                    <div class="para">{NewlySeminarList?.seminar_topic}</div>
                  </div>
                  <div class="img">
                    <Image
                      width={100}
                      height={100}
                      src={
                        NewlySeminarList?.singleImages?.img_url
                          ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                            NewlySeminarList?.singleImages?.img_url
                          : "./user-icon-image.png"
                      }
                      alt="user-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeminarBanner;
