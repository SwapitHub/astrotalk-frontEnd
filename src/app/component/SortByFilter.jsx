"use client";
import React from "react";

const SortByFilter = ({
  setSortFilterStatus,
  setSortFilterCharges,
  sortFilterCharges,
}) => {
  const handleSortChange = (e) => {
    const selectedId = e.target.id;
    setSortFilterCharges(selectedId);

    setSortFilterStatus(false);
  };
  return (
    <div class="sort-modal">
      <div className="main-recharge-popup">
        <div className="recharge-popup">
          <div class="sort-header">
            <span>SORT BY</span>
          
            <button
              onClick={() => {
                setSortFilterStatus(false);
              }}
            >
              {" "}
              <span>&times;</span>
            </button>
          </div>
          <div class="sort-options">
            {/* <label>
              <input type="radio" name="sort" /> <span>Popularity</span>
            </label> */}
            <div className="man-input-filed-sec">
            <label>
              <input
                type="radio"
                name="sort"
                id="experience_high_to_low"
                checked={sortFilterCharges === "experience_high_to_low"}
                onChange={handleSortChange}
              />{" "}
              <label>Experience : High to Low</label>
            </label>
            </div>
            <div className="man-input-filed-sec">
            <label>
              <input
                type="radio"
                name="sort"
                id="experience_low_to_high"
                checked={sortFilterCharges === "experience_low_to_high"}
                onChange={handleSortChange}
              />{" "}
              <label>Experience : Low to High</label>
            </label>
            </div>
            <div className="man-input-filed-sec">
            <label>
              <input
                type="radio"
                name="sort"
                id="order_high_to_low"
                checked={sortFilterCharges === "order_high_to_low"}
                onChange={handleSortChange}
              />{" "}
              <label>Total orders : High to Low</label>
            </label>
            </div>
            <div className="man-input-filed-sec">
            <label>
              <input
                type="radio"
                name="sort"
                id="order_low_to_high"
                checked={sortFilterCharges === "order_low_to_high"}
                onChange={handleSortChange}
              />{" "}
              <label>Total orders : Low to High</label>
            </label>
            </div>
            <div className="man-input-filed-sec">
            <label>
              <input
                type="radio"
                name="sort"
                id="charges_high_to_low"
                checked={sortFilterCharges === "charges_high_to_low"}
                onChange={handleSortChange}
              />{" "}
              <label>Price : High to Low</label>
            </label>
            </div>
            <div className="man-input-filed-sec">
            <label>
              <input
                type="radio"
                name="sort"
                id="charges_low_to_high"
                checked={sortFilterCharges === "charges_low_to_high"}
                onChange={handleSortChange}
              />{" "}
              <label>Price : Low to High</label>
            </label>
            </div>
            {/* <label>
              <input type="radio" name="sort" />{" "}
              <span>Rating : High to Low</span>
            </label> */}
          </div>
            <button
              className="reset"
              onClick={() => {
                setSortFilterCharges(" ");

                setSortFilterStatus(false);
              }}
            >
              Reset
            </button>
        </div>
      </div>
    </div>
  );
};

export default SortByFilter;