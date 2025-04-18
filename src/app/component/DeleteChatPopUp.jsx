"use client";

import axios from "axios";

const DeleteChatPopUp = ({ setShowDelete, deleteId, onDeleteSuccess }) => {
  const deleteOrderHistory = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userId-to-astrologer-astro-list-update`,
        {
          id: deleteId,
          DeleteOrderHistoryStatus: false
        }
      );

      setShowDelete(false);
      onDeleteSuccess(deleteId); // remove from UI or refetch
    } catch (error) {
      console.error("Error deleting order history:", error);
    }
  };

  return (
    <div className="parent-recharge-popup">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <h3>Delete Chat History</h3>
          <p>Are you sure you want to permanently delete this chat history?</p>
          <div className="button">
            <button onClick={() => setShowDelete(false)}>Cancel</button>
            <button onClick={deleteOrderHistory}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatPopUp;
