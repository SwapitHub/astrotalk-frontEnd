import Loader from "@/app/component/Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdOutlineRemoveRedEye } from "react-icons/md";
import secureLocalStorage from "react-secure-storage";

const UserList = ({ setUserListData }) => {
  const [userMainData, setUserMainData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login?page=${pageNumber}&limit=5`
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

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="outer-table">
          <table border="1">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>Date Of Birth</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {userMainData.map((item) => (
                <tr key={item._id}>
                  {/* <td>{item._id}</td> */}
                  <td>{item.name}</td>
                  <td>{item?.phone}</td>
                  <td>{item.gender}</td>
                  <td>{item.dateOfBirth}</td>
                  <td>
                    <button>Block</button>
                    <button className="delete-btn">
                     <MdOutlineRemoveRedEye />
                    </button>
                    <button className="delete-btn">
                      <FaEdit />
                    </button>
                    <button className="delete-btn">
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
