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
            <label>
              <input
                type="radio"
                name="sort"
                id="experience_high_to_low"
                checked={sortFilterCharges === "experience_high_to_low"}
                onChange={handleSortChange}
              />{" "}
              <span>Experience : High to Low</span>
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                id="experience_low_to_high"
                checked={sortFilterCharges === "experience_low_to_high"}
                onChange={handleSortChange}
              />{" "}
              <span>Experience : Low to High</span>
            </label>
            {/* <label>
              <input type="radio" name="sort" />{" "}
              <span>Total orders : High to Low</span>
            </label> */}
            {/* <label>
              <input type="radio" name="sort" />{" "}
              <span>Total orders : Low to High</span>
            </label> */}
            <label>
              <input
                type="radio"
                name="sort"
                id="charges_high_to_low"
                checked={sortFilterCharges === "charges_high_to_low"}
                onChange={handleSortChange}
              />{" "}
              <span>Price : High to Low</span>
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                id="charges_low_to_high"
                checked={sortFilterCharges === "charges_low_to_high"}
                onChange={handleSortChange}
              />{" "}
              <span>Price : Low to High</span>
            </label>
            {/* <label>
              <input type="radio" name="sort" />{" "}
              <span>Rating : High to Low</span>
            </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortByFilter;
