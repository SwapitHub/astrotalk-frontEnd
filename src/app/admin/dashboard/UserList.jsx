import axios from "axios";
import React, { useEffect, useState } from "react";

const UserList = () => {
  const [userMainData, setUserMainData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchUsers = async (pageNumber) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login?page=${pageNumber}&limit=2`
      );
      setUserMainData(res.data.users);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Date Of Birth</th>
          </tr>
        </thead>
        <tbody>
          {userMainData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.gender}</td>
              <td>{item.dateOfBirth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-wallet-inner">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!hasPrevPage}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
