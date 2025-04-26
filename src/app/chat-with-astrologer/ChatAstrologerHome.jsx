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
import { IoStar } from "react-icons/io5";
import { FaSortAmountDownAlt, FaFilter, FaSearch } from "react-icons/fa";
// const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`);
const socket = io(`${process.env.NEXT_PUBLIC_WEBSITE_URL}`, {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket"], // Try WebSocket first
  autoConnect: true,
  forceNew: true,
});

const ChatWithAstrologer = ({ languageListData, skillsListData }) => {
  const [showAstrologer, setShowAstrologer] = useState(null);
  const userIds = secureLocalStorage.getItem("userIds");
  const userMobile = Math.round(secureLocalStorage.getItem("userMobile"));
  const [showRecharge, setShowRecharge] = useState(false);
  const [userData, setUserData] = useState();
  const [astroMobileNum, setAstroMobileNum] = useState();
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortFilterStatus, setSortFilterStatus] = useState(false);
  const [multiFilterStatus, setMultiFilterStatus] = useState(false);
  const [sortFilterCharges, setSortFilterCharges] = useState();
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

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/astrologer-businessProfile?name=${searchName}&sortby=${sortFilterCharges}&page=1&limit=10&languages=${findLanguageListData}&professions=${findSkillsListData}&gender=${genderData}&country=${countryData}`
      );
      setShowAstrologer(response.data.profiles);
    } catch (err) {
      setError(err);
      console.error("Error fetching astrologers:", err);
      setShowAstrologer(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchName,
    sortFilterCharges,
    findLanguageListData,
    findSkillsListData,
    genderData,
    countryData,
  ]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timerId);
  }, [
    searchName,
    fetchData,
    sortFilterCharges,
    findLanguageListData,
    findSkillsListData,
    genderData,
    countryData,
  ]);

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
          setUserData(res.data);
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
    // profileImage,
    astroName,
    astroCharge,
    astroExperience
  ) => {
    if (!userIds) {
      console.error("userIds is undefined!");
      return;
    }
    if (userAmount >= astroCharge * 2) {
      try {
        // Navigate to the chat page
        // await router.push(`/chat-with-astrologer/user/${userIds}`);

        // This code will run after the navigation is complete
        secureLocalStorage.setItem("astrologerId", astrologerId);

        const messageId = {
          userIdToAst: userIds,
          astrologerIdToAst: astrologerId,
          mobileNumber: mobileNumber,
          // profileImage: profileImage,
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
    if (sortFilterStatus || multiFilterStatus) {
      document.body.classList.add("user-filter-popup");
    } else {
      document.body.classList.remove("user-filter-popup");
    }
  }, [sortFilterStatus, multiFilterStatus]);
  return (
    <>
      {showRecharge && (
        <UserRecharge
          setShowRecharge={setShowRecharge}
          astroMobileNum={astroMobileNum}
        />
      )}

      {sortFilterStatus && (
        <SortByFilter
          setSortFilterStatus={setSortFilterStatus}
          setSortFilterCharges={setSortFilterCharges}
          sortFilterCharges={sortFilterCharges}
        />
      )}

      {multiFilterStatus && (
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
        />
      )}

      <section className="talk-to-astrologer-bg">
        <div className="container">
          <div className="inner-talk-to-astrologer">
            <div className="talk-to-astrologer-left-content">
              <div className="heading-button">
                <span>Talk to Astrologer</span>
              </div>
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
                    href="/add-wallet-money/price-list"
                    title="Recharge"
                    className="recharge-button"
                  >
                    Recharge
                  </Link>
                </div>
                <div className="filter-button">
                  <button
                    className="filter-btn-ctm"
                    onClick={() => {
                      setMultiFilterStatus(true);
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
            showAstrologer.map((astrologer) => (
              <div key={astrologer.id}>{/* Render astrologer */}</div>
            ))
          ) : (
            <p>No results found</p>
          )}
          <div className="all-list-talk-to-astrologer">
            {showAstrologer?.map((item) => {
              return (
                <>
                  {item.profileStatus == true && (
                    <div className="inner-astrologer-detail">
                      <a href={`/best-astrologer/${item?.name}`} key={item.id}>
                        <div className="astrologer-list-left">
                          <div className="astrologer-profile">
                            <img src={`${item?.profileImage}`} alt="Sauvikh" />
                          </div>
                          <div className="five-star-rating">
                            <ul>
                              <li>
                                <IoStar />
                              </li>
                              <li>
                                <IoStar />
                              </li>
                              <li>
                                <IoStar />
                              </li>
                              <li>
                                <IoStar />
                              </li>
                              <li>
                                <IoStar />
                              </li>
                            </ul>
                          </div>
                          <div className="talk-to-total-orders">
                            <p> 3673 orders</p>
                          </div>
                        </div>
                        <div className="astrologer-list-center">
                          <div className="talk-to-name-sec">
                            <h5>{item.name}</h5>
                            <p>
                              {item.professions.map((item) => {
                                return <span>{item}</span>;
                              })}
                            </p>
                          </div>
                          <div className="talk-to-language">
                            <p>
                              {item.languages.map((item) => {
                                return <span>{item}</span>;
                              })}
                            </p>
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
                              {userAmount >= item.charges * 2 ? (
                                <a
                                  href={`/chat-with-astrologer/user/${userIds}`}
                                  onClick={() =>
                                    onChangeId(
                                      item._id,
                                      item.mobileNumber,
                                      // item.profileImage,
                                      item.name,
                                      item.charges,
                                      item.experience
                                    )
                                  }
                                >
                                  Chat{" "}
                                </a>
                              ) : (
                                <a
                                  href="#"
                                  onClick={() =>
                                    onChangeId(
                                      item._id,
                                      item.mobileNumber,
                                      // item.profileImage,
                                      item.name,
                                      item.charges,
                                      item.experience
                                    )
                                  }
                                >
                                  chat
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="astrologer-call-button-ctm chatStatus-false">
                              <button
                              // onClick={() =>
                              //   onChangeId(item._id, item.mobileNumber)
                              // }
                              >
                                Chat
                              </button>
                              <span>waiting 5 minutes</span>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatWithAstrologer;
