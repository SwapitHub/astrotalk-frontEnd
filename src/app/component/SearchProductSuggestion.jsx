import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SearchProductSuggestion = ({ searchTerm }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-shope-product-suggestions?query=${searchTerm}`
        );
        setSuggestions(res.data.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 500); // ⏱️ debounce by 300ms

    return () => clearTimeout(debounceTimer); // cleanup
  }, [searchTerm]);

  return (
    <>
      {searchTerm && (
        <div className="suggestion-dropdown">
          {loading && <div>Loading...</div>}
          {!loading && suggestions.length === 0 && searchTerm && (
            <div>No results found</div>
          )}

          {suggestions.map((product) => (
            <ul
              onClick={() =>
                router.push(
                  `/shop/${product?.shop_slug}/${product?.slug}${
                    product?.gemStone_product_price ? "?gemstone=true" : ""
                  }`
                )
              }
            >
              <li key={product._id}>
                <span className="search-product-img">
                  <img src={product.astroMallProductImg} alt={product.name} />
                </span>
                <span className="search-drop-details">
                  <span className="search-product-name">{product.name}</span>
                  <span className="search-discount-price">
                    - ₹{product.discount_price || product.starting_price}
                  </span>
                </span>
              </li>
            </ul>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchProductSuggestion;
