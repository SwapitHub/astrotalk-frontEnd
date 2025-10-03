import ShowLessShowMore from "@/app/component/ShowLessShowMore";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

const AstroDetail = ({
  astroMobileNumber,
  setAddActiveClass,
  setLoading,
  checkCompleteProfile,
}) => {
  const [astroDetailData, setAstroDetail] = useState();
  const [astroRegelationDetail, setAstroRegelationDetail] = useState();
  console.log(astroRegelationDetail);

  const astrologerDetail = async (astroMobileNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile-detail/${astroMobileNumber}`
      );
      setAstroDetail(res.data);
      console.log(res, "astroDetailData");
    } catch (err) {
      console.log(err, "astro detail not found");
    }
  };

  const astrologerRegelationDetail = async (astroMobileNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-detail/${astroMobileNumber}`
      );
      setAstroRegelationDetail(res.data.data);
      console.log(res, "astroDetailData");
    } catch (err) {
      console.log(err, "astro detail not found");
    }
  };

  useEffect(() => {
    if (astroMobileNumber && checkCompleteProfile) {
      astrologerDetail(astroMobileNumber);
      setLoading(false);
    } else if (astroMobileNumber && !checkCompleteProfile) {
      astrologerRegelationDetail(astroMobileNumber);
    } else {
      setLoading(true);
    }
  }, [astroMobileNumber]);

  // useEffect(() => {
  //   if (astroMobileNumber) {
  //     astrologerDetail(astroMobileNumber);
  //     // setLoading(false);
  //   } else {
  //     setLoading(true);
  //   }
  // }, [astroMobileNumber]);

  const renderStars = (averageRating) => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar =
      averageRating - fullStars >= 0.25 && averageRating - fullStars < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={`full-${i}`} />);
    }

    if (hasHalfStar) {
      stars.push(<IoStarHalf key="half" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IoStarOutline key={`empty-${i}`} />);
    }

    return stars;
  };

  const ratings = {
    5: astroDetailData?.averageRating_5,
    4: astroDetailData?.averageRating_4,
    3: astroDetailData?.averageRating_3,
    2: astroDetailData?.averageRating_2,
    1: astroDetailData?.averageRating_1,
  };

  const colorClasses = {
    5: "bg_green",
    4: "bg_blue",
    3: "bg_light_green",
    2: "bg_brown",
    1: "bg_voilet",
  };

  return (
    <div className="astro-detail-main">
      <span
        className="close"
        onClick={() => {
          setAddActiveClass(false);
        }}
      >
        X
      </span>

      {checkCompleteProfile ? (
        <div className="profile-table">
          <div className="inner-profile-table">
            <div className="common-profile">
              <div className="img">Image</div>
              <div className="input-outer">
                {astroDetailData?.profileImage ? (
                  <Image
                    width={100}
                    height={100}
                    src={
                      process.env.NEXT_PUBLIC_WEBSITE_URL +
                      astroDetailData?.profileImage
                    }
                    alt="user-icon"
                  />
                ) : (
                  <img src="./user-icon-image.png"></img>
                )}
              </div>
            </div>
            <div className="common-profile">
              <div className="name">Name</div>
              <div className="input-outer">{astroDetailData?.name}</div>
            </div>
            <div className="common-profile">
              <div className="mobile">mobileNumber</div>

              <div className="input-outer">{astroDetailData?.mobileNumber}</div>
            </div>
            <div className="common-profile">
              <div className="experience">Experience</div>

              <div className="input-outer">{astroDetailData?.experience}</div>
            </div>
            <div className="common-profile">
              <div className="charge">Charges</div>

              <div className="input-outer">{astroDetailData?.charges}</div>
            </div>
            <div className="common-profile">
              <div className="total-order">Total orders</div>

              <div className="input-outer">{astroDetailData?.totalOrders}</div>
            </div>
            <div className="common-profile">
              <div className="language">Languages</div>

              <div className="skills input-outer">
                {astroDetailData?.languages.map((item) => (
                  <>
                    <span>{item}</span>
                  </>
                ))}
              </div>
            </div>
            <div className="common-profile">
              <div className="professions">Professions</div>{" "}
              <div className="skills input-outer">
                {astroDetailData?.professions.map((item) => (
                  <span>{item}</span>
                ))}
              </div>
            </div>
            <div className="common-profile">
              <div className="spiritual">Spiritual Services</div>

              <div className="input-outer">
                {astroDetailData?.spiritual_services.map((item) => (
                  <div className="puja-detail">
                    <p>
                      Puja Name: <span>{item?.shop_name}</span>{" "}
                    </p>
                    <p>
                      Service Price: <span>{item?.service_price}</span>{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="common-profile">
              <div className="description">Description</div>

              <div className="input-outer">
                <ShowLessShowMore
                  description={astroDetailData?.Description}
                  totalWord={10}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2>
            {!astroRegelationDetail?.completeProfile &&
              "Astrologer Profile is not completed"}
          </h2>

          <div className="profile-table">
            <div className="inner-profile-table">
              <div className="common-profile">
                <div className="name">Name</div>
                <div className="input-outer">{astroRegelationDetail?.name}</div>
              </div>
              <div className="common-profile">
                <div className="email">Email</div>
                <div className="input-outer">
                  {astroRegelationDetail?.email}
                </div>
              </div>
              <div className="common-profile">
                <div className="deviceUse">DeviceUse</div>
                <div className="input-outer">
                  {astroRegelationDetail?.deviceUse}
                </div>
              </div>
              <div className="common-profile">
                <div className="mobile">MobileNumber</div>
                <div className="input-outer">
                  {astroRegelationDetail?.mobileNumber}
                </div>
              </div>
              <div className="common-profile">
                <div className="gender">Gender</div>
                <div className="input-outer">
                  {astroRegelationDetail?.gender}
                </div>
              </div>
              <div className="common-profile">
                <div className="language">Language</div>
                <div className="input-outer">
                  {astroRegelationDetail?.languages.map((item) => (
                    <>
                      <span>{item}</span>
                    </>
                  ))}
                </div>
              </div>
              <div className="common-profile">
                <div className="date-of-birth">DateOfBirth</div>
                <div className="input-outer">
                  {astroRegelationDetail?.dateOfBirth}
                </div>
              </div>
              <div className="common-profile">
                <div className="adharcard">AdharaCard</div>
                <div className="input-outer">
                  {astroRegelationDetail?.aadhaarCard ? (
                    <Link
                      href={`${
                        process.env.NEXT_PUBLIC_WEBSITE_URL +
                        astroRegelationDetail?.aadhaarCard
                      }`}
                      target="_blank"
                    >
                      <Image
                        width={100}
                        height={100}
                        src={
                          process.env.NEXT_PUBLIC_WEBSITE_URL +
                          astroRegelationDetail?.aadhaarCard
                        }
                        alt="user-icon"
                      />
                    </Link>
                  ) : (
                    <img src="./user-icon-image.png"></img>
                  )}
                </div>
              </div>
              <div className="common-profile">
                <div className="certificate">Certificate</div>
                <div className="input-outer">
                  {astroRegelationDetail?.certificate ? (
                    <Link
                      href={`${
                        process.env.NEXT_PUBLIC_WEBSITE_URL +
                        astroRegelationDetail?.certificate
                      }`}
                      target="_blank"
                    >
                      <Image
                        width={100}
                        height={100}
                        src={
                          process.env.NEXT_PUBLIC_WEBSITE_URL +
                          astroRegelationDetail?.certificate
                        }
                        alt="user-icon"
                      />
                    </Link>
                  ) : (
                    <img src="./user-icon-image.png"></img>
                  )}
                </div>
              </div>
              <div className="common-profile">
                <div className="charge">Charges</div>
                <div className="input-outer">0</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AstroDetail;
