"use client";
import useDebounce from "@/app/hook/useDebounce";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WalletView = ({ mobileNumber, setAddActiveClass, setLoading }) => {
  console.log(mobileNumber, "mobileNumber-12");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 800);

  const [astroDetailData, setAstroDetail] = useState(null);
  console.log(astroDetailData);

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [chatStatusRecord, setChatStatusRecord] = useState(false);
  const fetchUserWalletDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/get-all-astrologer-with-wallet-detail/${mobileNumber}?page=${pagination.page}&limit=${pagination.limit}&search=${debouncedSearch}`
      );

      setAstroDetail(res.data?.astrologer || null);
      setTransactions(res.data?.transactions || []);

      setPagination((prev) => ({
        ...prev,
        page: res.data?.pagination?.page || 1,
        totalPages: res.data?.pagination?.totalPages || 1,
        hasNextPage: res.data?.pagination?.hasNextPage || false,
        hasPrevPage: res.data?.pagination?.hasPrevPage || false,
      }));
    } catch (err) {
      console.error("Error fetching user wallet details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mobileNumber) {
      fetchUserWalletDetails(mobileNumber);
    }
  }, [mobileNumber, pagination.page, debouncedSearch]);

  return (
    <div className="astro-detail-main-view">
      <span
        className="close"
        onClick={() => {
          setAddActiveClass(false);
        }}
      >
        X
      </span>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Astrologer Details And Wallet Transition List
      </h2>

      {/* User Table */}

      <div className="profile-table">
        <div className="inner-profile-table">
          <div className="common-profile">
            <div className="name">Image</div>
            <div className="input-outer">
              <Image
                width={100}
                height={100}
                src={
                  astroDetailData?.profileImage
                    ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                      astroDetailData?.profileImage
                    : `/user-icon-image.png`
                }
                alt="user-icon"
              />
            </div>
          </div>
          <div className="common-profile">
            <div className="name">certificate</div>
            <div className="input-outer">
              <Link
                href={`${
                  process.env.NEXT_PUBLIC_WEBSITE_URL +
                  astroDetailData?.certificate
                }`}
                target="_blank"
              >
                <Image
                  width={100}
                  height={100}
                  src={
                    astroDetailData?.certificate
                      ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                        astroDetailData?.certificate
                      : `/user-icon-image.png`
                  }
                  alt="user-icon"
                />
              </Link>
            </div>
          </div>
          <div className="common-profile">
            <div className="name">aadhaarCard</div>
            <div className="input-outer">
              <Link
                href={`${
                  process.env.NEXT_PUBLIC_WEBSITE_URL +
                  astroDetailData?.aadhaarCard
                }`}
                target="_blank"
              >
                <Image
                  width={100}
                  height={100}
                  src={
                    astroDetailData?.aadhaarCard
                      ? process.env.NEXT_PUBLIC_WEBSITE_URL +
                        astroDetailData?.aadhaarCard
                      : `/user-icon-image.png`
                  }
                  alt="user-icon"
                />
              </Link>
            </div>
          </div>
          <div className="common-profile">
            <div className="name">Name</div>
            <div className="input-outer">{astroDetailData?.name}</div>
          </div>
          <div className="common-profile">
            <div className="mobile">Mobile Number</div>
            <div className="input-outer">{astroDetailData?.mobileNumber}</div>
          </div>
          <div className="common-profile">
            <div className="balance">AvaiLable Balance</div>
            <div className="input-outer">
              ₹ {Math.round(astroDetailData?.totalAvailableBalance) || 0}
            </div>
          </div>
          <div className="common-profile">
            <div className="date-of-birth">Experience</div>
            <div className="input-outer"> {astroDetailData?.experience}</div>
          </div>
          <div className="common-profile">
            <div className="date-of-birth">Charges</div>
            <div className="input-outer">₹ {astroDetailData?.charges}</div>
          </div>
          <div className="common-profile">
            <div className="date-of-birth">Country</div>
            <div className="input-outer"> {astroDetailData?.country}</div>
          </div>
          <div className="common-profile">
            <div className="gender">gender</div>
            <div className="input-outer"> {astroDetailData?.gender}</div>
          </div>
          <div className="common-profile">
            <div className="gender">topAstrologer</div>
            <div className="input-outer"> {astroDetailData?.topAstrologer}</div>
          </div>
          <div className="common-profile">
            <div className="language">language</div>
            <div className="input-outer">
              {" "}
              {astroDetailData?.languages.map((item) => {
                return item;
              })}
            </div>
          </div>
          <div className="common-profile">
            <div className="language">professions</div>
            <div className="input-outer">
              {" "}
              {astroDetailData?.professions.map((item) => {
                return item;
              })}
            </div>
          </div>
          <div className="common-profile">
            <div className="language">spiritual_services</div>
            <div className="input-outer">
              {" "}
              {astroDetailData?.spiritual_services.map((item) => (
                <div key={item?._id}>
                  <p>Name: {item?.shop_slug}</p>

                  <p>Price: {item?.service_price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="common-profile">
            <div className="date-time">Date and Time</div>
            <div className="input-outer">
              {" "}
              {astroDetailData?.createdAt &&
                new Date(astroDetailData?.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="common-profile">
            <div className="placeOfBorn">Description</div>
            <div className="input-outer">{astroDetailData?.Description}</div>
          </div>
        </div>
      </div>

      {/* Toggle Transactions */}
      <button
        onClick={() => {
          setChatStatusRecord(!chatStatusRecord);
        }}
      >
        {chatStatusRecord
          ? "Hide Wallet Transactions"
          : "Show Wallet Transactions"}
      </button>

      {/* Transactions Table */}
      {chatStatusRecord && (
        <div className="chat-record">
          <h2 style={{ textAlign: "center", margin: "20px 0" }}>
            Astrologer Wallet Transactions
          </h2>
          <div className="input-outer">
            <div className="balance">AvaiLable Balance</div>
            <div className="input-inner">
              ₹ {Math.round(astroDetailData?.totalAvailableBalance) || 0}
            </div>
          </div>

          {/* Search Box */}
          {/* <input
            type="search"
            placeholder="Search transaction id / type / status..."
            aria-label="Search wallet transactions"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 })); // reset to page 1 on search
            }}
          /> */}

          <div className="outer-table">
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  {/* <th>Transaction ID</th> */}
                  <th>Astrologer Name</th>
                  {/* <th>Available Balance</th> */}
                  <th>Transaction Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              {transactions?.length > 0 ? (
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      {/* <td>{tx?._id}</td> */}
                      <td>{tx.name}</td>{" "}
                      {/* <td>₹ {Math.round(tx.availableBalance)}</td>{" "} */}
                      <td>₹ {tx.transactionAmount}</td>{" "}
                      <td>{tx.description}</td>{" "}
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p colSpan="6" style={{ textAlign: "center" }}>
                  No Transactions Found
                </p>
              )}
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
