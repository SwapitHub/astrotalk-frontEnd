"use client"
import { useEffect, useState } from "react";
import { fetchAstroStatusList } from "../utils/api";

function AstroLogerList() {
    const [pendingData, setPendingData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchAstroStatusList();
          setPendingData(data);
        } catch (error) {
          console.error("Failed to fetch astrologer list", error);
        }
      };
  
      fetchData();
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