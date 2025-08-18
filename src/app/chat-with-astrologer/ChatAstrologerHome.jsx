"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import UserRecharge from "../component/UserRechargePopUp";
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import Loader from "../component/Loader";
import SortByFilter from "../component/SortByFilter";
import MultiFilters from "../component/MultiFilters";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { FaSortAmountDownAlt, FaFilter, FaSearch } from "react-icons/fa";
import UserOtpLoginData from "../component/UserOtpLoginData";
import { useRouter } from "next/navigation";
import RequestPopUp from "../component/RequestPopUp";
import Cookies from "js-cookie";

// const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`);
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`, {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket"],
  autoConnect: true,
  forceNew: true,
});

const ChatWithAstrologer = ({
  languageListData,
  skillsListData,
  chatAstrologerLit,
}) => {
  const router = useRouter();
  const [showAstrologer, setShowAstrologer] = useState(null);

  const [userIds, setUserIds] = useState();
  const [userMobile, setUserMobile] = useState();
  const [showRecharge, setShowRecharge] = useState(false);
  const [userData, setUserData] = useState();
  const [astroMobileNum, setAstroMobileNum] = useState();
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(
    secureLocalStorage.getItem("IsLoadingRequestStore")
  );
  const [error, setError] = useState(null);
  const [sortFilterStatus, setSortFilterStatus] = useState(false);
  const [multiFilterStatus, setMultiFilterStatus] = useState(false);
  const [sortFilterCharges, setSortFilterCharges] = useState();
  const [otpPopUpDisplay, setOtpPopUpDisplay] = useState(false);
  const [astrologerId, setAstrologerId] = useState();
  const [astrologerNotificationStatus, setAstrologerNotificationStatus] =
    useState(null);
  const [skipFetch, setSkipFetch] = useState(false);

  const [multiFilter, setMultiFilter] = useState();
  const [genderData, setGenderData] = useState(
    JSON.parse(secureLocalStorage.getItem("selectedGender")) || []
  );
  const [countryData, setCountryData] = useState(
    JSON.parse(secureLocalStorage.getItem("selectedCountry")) || []
  );

  const [findSkillsListData, setFindSkillsListData] = useState(
    JSON.parse(secureLocalStorage.getItem("selectedSkills")) || []
  );

  const [findLanguageListData, setFindLanguageListData] = useState(
    JSON.parse(secureLocalStorage.getItem("selectedLanguages")) || []
  );

  const [averageRating, setAverageRating] = useState(
    JSON.parse(secureLocalStorage.getItem("averageRating")) || []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const userMobiles = Math.round(Cookies.get("userMobile"));
    const userId = Cookies.get("userIds");
    setUserMobile(userMobiles);
    setUserIds(userId);

    const handleStorageChange = () => {
      const updatedMobile = Cookies.get("userMobile");
      if (updatedMobile) {
        setUserMobile(updatedMobile);
      }
    };

    const handleStorageChangeRemoved = () => {
      setUserMobile(undefined);
      setUserData(undefined);
    };

    window.addEventListener("userMobileUpdated", handleStorageChange);
    window.addEventListener(
      "userMobileUpdatedRemoved",
      handleStorageChangeRemoved
    );

    return () => {
      window.removeEventListener("userMobileUpdated", handleStorageChange);
      window.removeEventListener(
        "userMobileUpdatedRemoved",
        handleStorageChangeRemoved
      );
    };
  }, [userMobile, userIds]);

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    if (skipFetch) return;
    setError(null);
    if (currentPage === 1) setIsLoading(true);
    let limit = 4;
    try {
      const response = await axios.get(`
        ${
          process.env.NEXT_PUBLIC_WEBSITE_URL
        }/astrologer-businessProfile?name=${searchName}&sortby=${
        sortFilterCharges || ""
      }&page=${currentPage}&limit=${limit}&languages=${findLanguageListData}&professions=${findSkillsListData}&gender=${genderData}&country=${countryData}&minAverageRating=${averageRating}&profileStatus=true
      `);

      const profiles = response.data.profiles;

      setShowAstrologer((prev) => {
        return currentPage === 1 ? profiles : [...(prev || []), ...profiles];
      });

      setHasMore(profiles.length == limit);
    } catch (err) {
      console.error("Error fetching astrologers:", err);
      setError(err);
      if (currentPage === 1) setShowAstrologer([]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [
    currentPage,
    searchName,
    sortFilterCharges,
    findLanguageListData,
    findSkillsListData,
    genderData,
    countryData,
    averageRating,
    skipFetch,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [
    searchName,
    sortFilterCharges,
    findLanguageListData,
    findSkillsListData,
    genderData,
    countryData,
    averageRating,
  ]);
  useEffect(() => {
    if (!skipFetch) {
      fetchData();
    }
  }, [currentPage, fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400 &&
        hasMore &&
        !isFetchingMore &&
        !isLoading
      ) {
        setIsFetchingMore(true);
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetchingMore, isLoading]);

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  useEffect(() => {
    if (userMobile) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login-detail/${userMobile}`
        )
        .then((res) => {
          setUserData(res.data.data);
        })
        .catch((err) => {
          console.log(err, "user login api error");
        });
    }
  }, [userMobile]);

  useEffect(() => {
    if (showRecharge) {
      document.body.classList.add("user-recharge");
    } else {
      document.body.classList.remove("user-recharge");
    }
  }, [showRecharge]);

  const userAmount = userData?.totalAmount;

  const onChangeId = async (
    astrologerId,
    mobileNumber,
    profileImage,
    astroName,
    astroCharge,
    astroExperience
  ) => {
    setSkipFetch(true);
    if (!userIds) {
      return;
    }
    if (userAmount >= astroCharge * 2) {
      try {
        // Navigate to the chat page
        // await router.push(`/chat-with-astrologer/user/${userIds}`);

        // This code will run after the navigation is complete
        secureLocalStorage.setItem("IsLoadingRequestStore", true);
        setIsLoadingRequest(true);

        Cookies.set("astrologerId", astrologerId, {
          expires: 3650,
          secure: true,
          sameSite: "Strict",
        });

        const messageId = {
          userIdToAst: userIds,
          astrologerIdToAst: astrologerId,
          mobileNumber: mobileNumber,
          profileImage: profileImage,
          astroName: astroName,
          astroCharges: astroCharge,
          astroExperience: astroExperience,
          chatId: "",
          chatType: "free",
          chatDuration: "0 min",
          chatDeduction: "0",
          DeleteOrderHistoryStatus: true,
          chatStatus: true,
          userName: userData?.name,
          userDateOfBirth: userData?.dateOfBirth,
          userPlaceOfBorn: userData?.placeOfBorn,
          userBornTime: userData?.reUseDateOfBirth,
        };

        socket.emit("userId-to-astrologer", messageId);
        socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 0 });
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    } else {
      setShowRecharge(true);
      setAstroMobileNum(mobileNumber);
    }
  };

  useEffect(() => {
    // Listen for success event from the server
    socket.on("userId-to-astrologer-success", (data) => {
      // console.log("userId and astrologerId saved successfully:", data);
    });

    // Listen for error event from the server
    socket.on("userId-to-astrologer-error", (error) => {
      console.error("Error saving userId and astrologerId:", error);
      // You can update the UI or show an error message here
    });

    return () => {
      // Clean up event listeners
      socket.off("userId-to-astrologer-success");
      socket.off("userId-to-astrologer-error");
    };
  }, []);

  useEffect(() => {
    // Remove all related classes first
    document.body.classList.remove(
      "sort-user-filter-popup",
      "multi-user-filter-popup",
      "loading-user-filter-popup"
    );

    // Add the correct one based on the current status
    if (sortFilterStatus) {
      document.body.classList.add("sort-user-filter-popup");
    } else if (multiFilterStatus) {
      document.body.classList.add("multi-user-filter-popup");
    } else if (isLoadingRequest) {
      document.body.classList.add("loading-user-filter-popup");
    }
  }, [sortFilterStatus, multiFilterStatus, isLoadingRequest]);

  const handelUserLogin = () => {
    setOtpPopUpDisplay(true);
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log("Received data:", data.astrologerData);
      const id = data.astrologerData?._id;
      setAstrologerId(id);
      const newStatus = data.astrologerData.chatStatus;
      setAstrologerNotificationStatus((prevStatus) => {
        if (prevStatus !== newStatus) {
          Cookies.set("AstrologerNotificationStatus", newStatus);
          return newStatus;
        }
        return prevStatus;
      });
    };

    socket.on("connect", () => console.log("Connected to socket.io server"));
    socket.on(
      "astrologer-data-received-new-notification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "astrologer-data-received-new-notification",
        handleNewNotification
      );
    };
  }, [socket]);

  // ✅ Monitor astrologerId and redirect when it updates
  useEffect(() => {
    if (isLoadingRequest) {
      if (astrologerId) {
        router.push(`/chat-with-astrologer/user/${userIds}`);
        Cookies.set("astrologerId", astrologerId, {
          expires: 3650,
          secure: true,
          sameSite: "Strict",
        });

        secureLocalStorage.setItem("IsLoadingRequestStore", false);
        setIsLoadingRequest(false);
      } else {
        setIsLoadingRequest(true);
        secureLocalStorage.setItem("IsLoadingRequestStore", true);

        console.log("No astrologer found. Timer fallback logic can go here.");

        // return () => clearTimeout(timer);
      }
    }
  }, [astrologerId, isLoadingRequest]);

  // ✅ Main function that gets called on Free Chat click
  const handleUpdateUserDetail = async (e) => {
    e.preventDefault();
    setIsLoadingRequest(true);
    secureLocalStorage.setItem("IsLoadingRequestStore", true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${userMobile}`,
        {
          freeChatStatus: true,
        }
      );

      console.log("User update response:", response.data);

      if (response.data.message === "success") {
        const freeChatResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile/free-chat-true`
        );
        const astrologers = freeChatResponse.data.data;
        console.log("astrologers===========", astrologers);

        astrologers.forEach((item) => {
          const newData = fetch(
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/update-business-profile/${item?.mobileNumber}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                requestStatus: true,
              }),
            }
          );

          sendMessageRequest(item);
        });
      }
      socket.emit("astrologer-chat-request-FreeChat", {
        requestStatus: "freeChat",
      });
      socket.emit("astrologer-chat-requestPaidChat", { requestStatus: 0 });
    } catch (error) {
      console.error("Update user freeChatStatus error:", error);
    }
  };

  const sendMessageRequest = (item) => {
    if (!userIds) {
      console.error("userIds undefined");
      return;
    }

    // secureLocalStorage.setItem("astrologerId", item._id);

    const messageId = {
      userIdToAst: userIds,
      astrologerIdToAst: item._id,
      mobileNumber: item.mobileNumber,
      astroName: item.name,
      astroCharges: item.charges,
      astroExperience: item.experience,
      chatId: "",
      chatType: "free",
      chatDuration: "0 min",
      chatDeduction: "0",
      DeleteOrderHistoryStatus: true,
      chatStatus: true,
      userName: userData?.name,
      userDateOfBirth: userData?.dateOfBirth,
      userPlaceOfBorn: userData?.placeOfBorn,
      userBornTime: userData?.reUseDateOfBirth,
      requestStatus: true,
    };

    socket.emit("userId-to-astrologer", messageId);
    socket.emit("astrologer-chat-requestStatus", { requestStatus: true });
  };

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

  return (
    <main className="main-content">
      {isLoadingRequest && (
        <RequestPopUp setIsLoadingRequest={setIsLoadingRequest} />
      )}
      {showRecharge && (
        <UserRecharge
          setShowRecharge={setShowRecharge}
          astroMobileNum={astroMobileNum}
        />
      )}

      <SortByFilter
        setSortFilterStatus={setSortFilterStatus}
        setSortFilterCharges={setSortFilterCharges}
        sortFilterCharges={sortFilterCharges}
      />

      <MultiFilters
        setMultiFilterStatus={setMultiFilterStatus}
        setMultiFilter={setMultiFilter}
        multiFilter={multiFilter}
        findSkillsListData={findSkillsListData}
        setFindSkillsListData={setFindSkillsListData}
        setFindLanguageListData={setFindLanguageListData}
        findLanguageListData={findLanguageListData}
        countryData={countryData}
        setCountryData={setCountryData}
        genderData={genderData}
        setGenderData={setGenderData}
        languageListData={languageListData}
        skillsListData={skillsListData}
        averageRating={averageRating}
        setAverageRating={setAverageRating}
      />

      {otpPopUpDisplay && (
        <div className={otpPopUpDisplay == true && `outer-send-otp-main`}>
          <UserOtpLoginData setOtpPopUpDisplay={setOtpPopUpDisplay} />
        </div>
      )}
      <section className="talk-to-astrologer-bg">
        <div className="container">
          <div className="talk-to-astrologer-wrap">
            <div className="inner-talk-to-astrologer">
              <div className="talk-to-astrologer-left-content">
                <div className="heading-button">
                  <span>Talk to Astrologer</span>
                </div>
                {!userData?.freeChatStatus == true && (
                  <div className="free-chat-btn">
                    <Link
                      // href="#"
                      href={`/chat-with-astrologer/user/${userIds}`}
                      onClick={handleUpdateUserDetail}
                    >
                      Free Chat
                    </Link>
                  </div>
                )}

                <div className="available-bbalance-text">
                  <p>
                    Available Balance:{" "}
                    <span>
                      ₹ {userData?.totalAmount ? userData?.totalAmount : 0}
                    </span>
                  </p>
                </div>
              </div>
              <div className="talk-to-astrologer-right-content">
                <div className="inner-talk-to-astrologer-right-content">
                  <div className="recharge-btm">
                    <Link
                      href={`${
                        !userMobile || !userIds
                          ? "#"
                          : `/add-wallet-money/price-list`
                      }`}
                      title="Recharge"
                      className="recharge-button"
                      onClick={() => {
                        if (!userMobile || !userIds) {
                          handelUserLogin();
                        }
                      }}
                    >
                      Recharge
                    </Link>
                  </div>
                  <div className="filter-button">
                    <button
                      className="filter-btn-ctm"
                      onClick={() => {
                        if (!userMobile || !userIds) {
                          handelUserLogin();
                        } else {
                          setMultiFilterStatus(true);
                        }
                      }}
                    >
                      <FaFilter />
                      Filter
                    </button>
                  </div>
                  <div className="filter-button">
                    <button
                      className="sort-btn-ctm"
                      onClick={() => setSortFilterStatus(true)}
                    >
                      <FaSortAmountDownAlt /> Sort by{" "}
                    </button>
                  </div>
                  <div className="filter-button search-box-top-btn">
                    <div className="search-box-filed">
                      <input
                        type="search"
                        id="astrologer-search"
                        name="astrologer-search"
                        placeholder="Search name..."
                        value={searchName}
                        onChange={handleSearchChange}
                        aria-label="Search astrologers by name"
                      />
                    </div>
                    <div className="search-button-filed">
                      <button type="submit">
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {isLoading && <Loader />}
            {error && <p className="error">Error fetching data</p>}

            {/* Show nothing by default (showAstrologer === null) */}
            {showAstrologer === null ? null : showAstrologer?.length > 0 ? (
              <div className="all-list-talk-to-astrologer">
                {showAstrologer?.map((item) => {
                  return (
                    <>
                      {item.profileStatus == true && (
                        <div className="inner-astrologer-detail">
                          <Link
                            href={`/best-astrologer/${item?.name}`}
                            key={item.id}
                          >
                            {item.topAstrologer && (
                              <div className="star-banner">
                                {item.topAstrologer == "celebrity"
                                  ? "Celebrity"
                                  : item.topAstrologer == "rising_star"
                                  ? "Rising Star"
                                  : item.topAstrologer == "top_choice"
                                  ? "Top Choice"
                                  : ""}
                              </div>
                            )}

                            <div className="astrologer-list-left">
                              <div className="astrologer-profile">
                                <img
                                  src={`${item?.profileImage}`}
                                  alt={item?.name}
                                />
                              </div>
                              <div className="five-star-rating">
                                <ul className="stars">
                                  <li>{renderStars(item?.averageRating)}</li>
                                </ul>
                              </div>
                              <div className="talk-to-total-orders">
                                <p> {item?.totalOrders} orders</p>
                              </div>
                            </div>
                            <div className="astrologer-list-center">
                              <div className="talk-to-name-sec">
                                <h5>{item.name}</h5>
                                <div className="skills">
                                  {item.professions.map((item) => {
                                    return <span>{item}</span>;
                                  })}
                                </div>
                              </div>
                              <div className="talk-to-language">
                                {item.languages.map((item) => {
                                  return <span>{item}</span>;
                                })}
                              </div>
                              <div className="exp-year-sec">
                                <p>
                                  Exp:{" "}
                                  <span className="ctm-carly-breaks">
                                    {item.experience}
                                  </span>{" "}
                                  Years
                                </p>
                              </div>
                              <div className="talk-to-time-sec">
                                <p>
                                  ₹ {item.charges}{" "}
                                  <span>
                                    {/* <span className="ctm-carly-breaks">
                                {item.minute}
                              </span> */}
                                    <span className="ctm-carly-breaks">/</span>{" "}
                                    min
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="astrologer-list-right">
                              <div className="Verified-Sticker-icon">
                                <img
                                  src="./Verified-Sticker.png"
                                  alt="Verified Sticker"
                                />
                              </div>

                              {item.chatStatus == false ? (
                                <div className="astrologer-call-button-ctm">
                                  {!userData?.name ? (
                                    <Link href="/free-chat/start">Chat</Link>
                                  ) : userAmount >= item.charges * 2 ? (
                                    <Link
                                      href="#"
                                      onClick={() => {
                                        onChangeId(
                                          item._id,
                                          item.mobileNumber,
                                          item.profileImage,
                                          item.name,
                                          item.charges,
                                          item.experience
                                        );
                                      }}
                                    >
                                      Chat
                                    </Link>
                                  ) : !userMobile || !userIds ? (
                                    <Link href="#" onClick={handelUserLogin}>
                                      chat
                                    </Link>
                                  ) : (
                                    <Link
                                      href="#"
                                      onClick={() =>
                                        onChangeId(
                                          item._id,
                                          item.mobileNumber,
                                          item.profileImage,
                                          item.name,
                                          item.charges,
                                          item.experience
                                        )
                                      }
                                    >
                                      chat
                                    </Link>
                                  )}
                                </div>
                              ) : (
                                <div className="astrologer-call-button-ctm chatStatus-false">
                                  <Link
                                    href={
                                      userData?.chatStatus
                                        ? `/chat-with-astrologer/user/${userIds}`
                                        : "#"
                                    }
                                    // onClick={() =>
                                    //   onChangeId(item._id, item.mobileNumber)
                                    // }
                                  >
                                    Chat
                                  </Link>
                                  <span>waiting 5 minutes</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      )}
                    </>
                  );
                })}
                {isFetchingMore && <Loader />}
              </div>
            ) : (
              <p>No results found</p>
            )}
          </div>
          {/* // server rendering side code start here */}
          <div
            className="all-list-talk-to-astrologer"
            style={{ display: "none" }}
          >
            {chatAstrologerLit?.map((item) => {
              return (
                <>
                  {item.profileStatus == true && (
                    <div className="inner-astrologer-detail">
                      <Link
                        href={`/best-astrologer/${item?.name}`}
                        key={item.id}
                      >
                        {item.topAstrologer && (
                          <div className="star-banner">
                            {item.topAstrologer == "celebrity"
                              ? "Celebrity"
                              : item.topAstrologer == "rising_star"
                              ? "Rising Star"
                              : item.topAstrologer == "top_choice"
                              ? "Top Choice"
                              : ""}
                          </div>
                        )}

                        <div className="astrologer-list-left">
                          <div className="astrologer-profile">
                            <img
                              src={`${item?.profileImage}`}
                              alt={item?.name}
                            />
                          </div>
                          <div className="five-star-rating">
                            <ul className="stars">
                              <li>{renderStars(item?.averageRating)}</li>
                            </ul>
                          </div>
                          <div className="talk-to-total-orders">
                            <p> {item?.totalOrders} orders</p>
                          </div>
                        </div>
                        <div className="astrologer-list-center">
                          <div className="talk-to-name-sec">
                            <h5>{item.name}</h5>
                            <div className="skills">
                              {item.professions.map((item) => {
                                return <span>{item}</span>;
                              })}
                            </div>
                          </div>
                          <div className="talk-to-language">
                            {item.languages.map((item) => {
                              return <span>{item}</span>;
                            })}
                          </div>
                          <div className="exp-year-sec">
                            <p>
                              Exp:{" "}
                              <span className="ctm-carly-breaks">
                                {item.experience}
                              </span>{" "}
                              Years
                            </p>
                          </div>
                          <div className="talk-to-time-sec">
                            <p>
                              ₹ {item.charges}{" "}
                              <span>
                                {/* <span className="ctm-carly-breaks">
                                {item.minute}
                              </span> */}
                                <span className="ctm-carly-breaks">/</span> min
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="astrologer-list-right">
                          <div className="Verified-Sticker-icon">
                            <img
                              src="./Verified-Sticker.png"
                              alt="Verified Sticker"
                            />
                          </div>

                          {item.chatStatus == false ? (
                            <div className="astrologer-call-button-ctm">
                              {!userData?.name ? (
                                <Link href="/free-chat/start">Chat</Link>
                              ) : userAmount >= item.charges * 2 ? (
                                <Link
                                  href="#"
                                  onClick={() => {
                                    onChangeId(
                                      item._id,
                                      item.mobileNumber,
                                      item.profileImage,
                                      item.name,
                                      item.charges,
                                      item.experience
                                    );
                                  }}
                                >
                                  Chat
                                </Link>
                              ) : !userMobile || !userIds ? (
                                <Link href="#" onClick={handelUserLogin}>
                                  chat
                                </Link>
                              ) : (
                                <Link
                                  href="#"
                                  onClick={() =>
                                    onChangeId(
                                      item._id,
                                      item.mobileNumber,
                                      item.profileImage,
                                      item.name,
                                      item.charges,
                                      item.experience
                                    )
                                  }
                                >
                                  chat
                                </Link>
                              )}
                            </div>
                          ) : (
                            <div className="astrologer-call-button-ctm chatStatus-false">
                              <Link
                                href={
                                  userData?.chatStatus
                                    ? `/chat-with-astrologer/user/${userIds}`
                                    : "#"
                                }
                                // onClick={() =>
                                //   onChangeId(item._id, item.mobileNumber)
                                // }
                              >
                                Chat
                              </Link>
                              <span>waiting 5 minutes</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  )}
                </>
              );
            })}
            {isFetchingMore && <Loader />}
          </div>
          {/* // server side code end here */}
        </div>
      </section>
    </main>
  );
};

export default ChatWithAstrologer;
