import DeletePopUp from "@/app/component/DeletePopUp";
import Loader from "@/app/component/Loader";
import useDebounce from "@/app/hook/useDebounce";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";
import WalletView from "./wallet/WalletViewUser";
import WalletEdit from "./wallet/WalletEditUser";
import BlockUnblock from "@/app/component/BlockUnblock";

const UserList = () => {
  let showNameData = "User";

  const [userMainData, setUserMainData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addActiveClass, setAddActiveClass] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [addActiveClassEdit, setAddActiveClassEdit] = useState();

  const [showBlockUnblock, setShowBlockUnblock] = useState(false);
  const [blockUnblockPermanently, setBlockUnblockPermanently] = useState();
  const [updateBlockUnblock, setUpdateBlockUnblock] = useState();
  const [blockUnblock, setBlockUnblock] = useState();

  // 🚀 Fetch user data with pagination & search
  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login?page=${pageNumber}&limit=5&search=${debouncedSearch}`
      );
      secureLocalStorage.setItem("totalUsersList", res.data.totalUsers);
      setUserMainData(res.data.users);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Call fetchUsers on page or search change
  useEffect(() => {
    fetchUsers(page);
  }, [page, debouncedSearch]);

  // 🧱 Update block/unblock user
  const updateBlockUnblockUser = async (id, status) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${id}`,
        { blockUser: status }
      );
      fetchUsers(page);
    } catch (error) {
      console.error("Failed to update block status:", error);
    }
  };

  // 🧱 Soft-delete user
  const deleteUser = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-user/${selectedUserId}`,
        { deleteUser: true }
      );
      setShowDelete(false);
      fetchUsers(page);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  useEffect(() => {
    if (selectedUserId && deletePermanently) {
      deleteUser();
    }
  }, [deletePermanently]);

  useEffect(() => {
    if (blockUnblock?.id && blockUnblockPermanently) {
      updateBlockUnblockUser(blockUnblock.id, blockUnblock.blockUser);
      setBlockUnblockPermanently(false); // reset after action
    }
  }, [blockUnblockPermanently]);

  // useEffect(() => {
  //   if (addActiveClass) {
  //     document.body.classList.add("wallet-view-popup-list");
  //   } else {
  //     document.body.classList.remove("wallet-view-popup-list");
  //   }
  // }, [addActiveClass]);

  useEffect(() => {
    if (addActiveClassEdit) {
      document.body.classList.add("wallet-edit-popup");
    } else {
      document.body.classList.remove("wallet-edit-popup");
    }
  }, [addActiveClassEdit]);
  return (
    <>
      {/* 🔔 Delete confirmation popup */}
      {showDelete && (
        <DeletePopUp
          setShowDelete={setShowDelete}
          setDeletePermanently={setDeletePermanently}
          showNameData={showNameData}
        />
      )}
      {showBlockUnblock && (
        <BlockUnblock
          setShowBlockUnblock={setShowBlockUnblock}
          setBlockUnblockPermanently={setBlockUnblockPermanently}
          showNameData={showNameData}
          updateBlockUnblock={updateBlockUnblock}
          
        />
      )}
      {addActiveClass && (
        <WalletView
          mobileNumber={mobileNumber}
          setAddActiveClass={setAddActiveClass}
          setLoading={setLoading}
        />
      )}

      {addActiveClassEdit && (
        <WalletEdit
          userMobile={mobileNumber}
          setAddActiveClassEdit={setAddActiveClassEdit}
          fetchTransactions={fetchUsers}
          setLoading={setLoading}
        />
      )}
      {/* 🔄 Loader while fetching */}
      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
          {/* 🔍 Search input */}
        <h1>User  List</h1>

          <div className="search-box-top-btn">
            <div className="search-box-filed">
              <input
                type="search"
                id="astrologer-search"
                name="astrologer-search"
                placeholder="Search name or mobile..."
                aria-label="Search wallet transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-button-filed">
              <button type="button">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* 📄 User Table */}
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>Date Of Birth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userMainData.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.gender}</td>
                  <td>{item.dateOfBirth}</td>

                  <td>
                    {/* 🔘 Block/Unblock */}
                    <button
                      onClick={() => {
                        setBlockUnblock({
                          id: item._id,
                          blockUser: !item.blockUser, 
                        });
                        setUpdateBlockUnblock(!item.blockUser); 
                        setShowBlockUnblock(true);
                      }}
                    >
                      {item.blockUser ? "Unblock" : "Block"}
                    </button>

                    {/* 👁 View */}
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setAddActiveClass(true);
                        setMobileNumber(item.phone);
                      }}
                    >
                      <MdOutlineRemoveRedEye />
                    </button>

                    {/* ✏️ Edit */}
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setAddActiveClassEdit(true);
                        setMobileNumber(item.phone);
                      }}
                    >
                      <FaEdit />
                    </button>

                    {/* ❌ Delete */}
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedUserId(item._id);
                        setShowDelete(true);
                      }}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔁 Pagination */}
      <div className="admin-wallet-inner">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage || loading}
          className={!hasPrevPage ? "disable" : ""}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage || loading}
          className={!hasNextPage ? "disable" : ""}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default UserList;
