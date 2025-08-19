import React, { useState } from 'react';

function DescriptionCell({ description, totalWord }) {
  const [showFull, setShowFull] = useState(false);

  const words = description?.split(' ') || [];
  const shortText = words.slice(0, totalWord).join(' '); // adjust 20 to desired word count

  return (
    <>
      {showFull ? description : shortText}
      {words.length > totalWord && (
        <span
          onClick={() => setShowFull(!showFull)}
          style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
        >
          {showFull ? "Show less" : "... Show more"}
        </span>
      )}
    </>
  );
}

export default DescriptionCell;
