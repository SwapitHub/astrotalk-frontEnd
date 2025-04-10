"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function AstrologerPendingList() {
  const [pendingData, setPendingData] = useState([]);
  const [updateData, setUpdateData] = useState();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=false`
      )
      .then((response) => {
        setPendingData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updateData]);

  const updateAstrologerStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/update-astro-status/${id}`,
        {
          astroStatus: newStatus,
        }
      );
      setUpdateData(response.data);
    } catch (error) {
      console.error(
        "Failed to update astrologer status:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>
                <button
                  onClick={() =>
                    updateAstrologerStatus(item._id, !item.astroStatus)
                  }
                >
                  {item.astroStatus ? "Active" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AstrologerPendingList;
