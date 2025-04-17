"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";

function AstroLogerList() {
    const [pendingData, setPendingData] = useState([]);
  
    useEffect(() => {
      axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/astrologer-list?astroStatus=true`)
      .then((response) => {
          setPendingData(response.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  
 

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {pendingData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.mobileNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AstroLogerList;