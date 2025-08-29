import React from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { IoTimeOutline } from 'react-icons/io5'
import { SlCalender } from "react-icons/sl";

const SeminarBanner = ({NewlySeminarList}) => {
  return (
    <section class="seminar-bannner">
        <div class="container">
            <div class="seminar_wrapper">
                <div class="seminar-banner-row">
                    <div class="left_col">
                        <div class="content">
                            <div className="new">
                                new
                            </div>
                            <h1>
                                <span> <strong>2025</strong> Astrologer {" "}</span>
                                Seminar
                            </h1>
                            <p>{NewlySeminarList?.seminar_detail}</p>
                        </div>
                        <div class="seminar_btn">
                            <button>Book your seat today</button>
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
                                    <img src={NewlySeminarList?.singleImages?.img_url} alt={NewlySeminarList?.name}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="seminar_date_location">
                    <div class="row">
                        <div class="sm-dl-col">
                            <div class="icon">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <div class="text-date">
                                <SlCalender /><span>{NewlySeminarList?.date_of_seminar}</span>
                            </div>
                        </div>
                        <div class="sm-dl-col">
                            <div class="icon">
                                <i class="fa-solid fa-clock"></i>
                            </div>
                            <div class="text-date">
                               <IoTimeOutline /> <span>{NewlySeminarList?.time_of_seminar}</span>
                            </div>
                        </div>
                        <div class="sm-dl-col">
                            <div class="icon">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div class="text-date">
                                <CiLocationOn /><span>{NewlySeminarList?.location_seminar}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

  )
}

export default SeminarBanner