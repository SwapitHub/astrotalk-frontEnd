import ShowLessShowMore from "@/app/component/ShowLessShowMore";
import axios from "axios";
import Image from "next/image";
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
      <div className="outer-table">
        {checkCompleteProfile ? (
          <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>mobileNumber</th>
                <th>Experience</th>
                <th>Charges</th>
                <th>Total orders</th>
                <th>Languages</th>
                <th>Professions</th>
                <th>Spiritual Services</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
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
                </td>
                <td>{astroDetailData?.name}</td>
                <td>{astroDetailData?.mobileNumber}</td>
                <td>{astroDetailData?.experience}</td>
                <td>{astroDetailData?.charges}</td>
                <td>{astroDetailData?.totalOrders}</td>
                <td>
                  <div className="skills">
                    {astroDetailData?.languages.map((item) => (
                      <>
                        <span>{item}</span>
                      </>
                    ))}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="skills">
                    {astroDetailData?.professions.map((item) => (
                      <span>{item}</span>
                    ))}
                  </div>
                </td>
                <td>
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
                </td>
                <td>
                  <ShowLessShowMore
                    description={astroDetailData?.Description}
                    totalWord={10}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            <h2>
              {!astroRegelationDetail?.completeProfile &&
                "Astrologer Profile is not completed"}
            </h2>

            <table border="1" cellPadding="8" style={{ marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>DeviceUse</th>
                  <th>MobileNumber</th>
                  <th>Gender</th>
                  <th>Language</th>
                  <th>DateOfBirth</th>
                  <th>AdharaCard</th>
                  <th>Certificate</th>
                  <th>Charges</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{astroRegelationDetail?.name}</td>
                  <td>{astroRegelationDetail?.email}</td>
                  <td>{astroRegelationDetail?.deviceUse}</td>
                  <td>{astroRegelationDetail?.mobileNumber}</td>
                  <td>{astroRegelationDetail?.gender}</td>
                  <td>
                    {astroRegelationDetail?.languages.map((item) => (
                      <>
                        <span>{item}</span>
                      </>
                    ))}
                  </td>
                  <td>{astroRegelationDetail?.dateOfBirth}</td>
                  <td>
                    {astroRegelationDetail?.aadhaarCard ? (
                      <Image
                        width={100}
                        height={100}
                        src={
                          process.env.NEXT_PUBLIC_WEBSITE_URL +
                          astroRegelationDetail?.aadhaarCard
                        }
                        alt="user-icon"
                      />
                    ) : (
                      <img src="./user-icon-image.png"></img>
                    )}
                  </td>
                  <td>
                    {astroRegelationDetail?.certificate ? (
                      <Image
                        width={100}
                        height={100}
                        src={
                          process.env.NEXT_PUBLIC_WEBSITE_URL +
                          astroRegelationDetail?.certificate
                        }
                        alt="user-icon"
                      />
                    ) : (
                      <img src="./user-icon-image.png"></img>
                    )}
                  </td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AstroDetail;
