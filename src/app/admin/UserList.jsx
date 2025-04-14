import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const UserList = () => {
    const [userMainData, setUserMainData] = useState([]);
  
    useEffect(() => {
      axios
      .get(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/user-login`)
      .then((response) => {
          setUserMainData(response.data)
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
    </div>
  );
};

export default UserList;
