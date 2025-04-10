import { useEffect, useState } from "react";
import { fetchUserList } from "../utils/api";

const UserList = () => {
  const [userMainData, setUserMainData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserList();
        setUserMainData(data);
      } catch (error) {
        console.error("Failed to fetch user list", error);
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
