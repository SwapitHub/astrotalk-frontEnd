import React, { useState } from 'react';

function DescriptionCell({ description, totalWord }) {
  const [showFull, setShowFull] = useState(false);

  const words = description?.split(' ') || [];
  const shortText = words.slice(0, totalWord).join(' '); 

  return (
    <>
      {showFull ? description : shortText}
      {words.length > totalWord && (
        <span
          onClick={() => setShowFull(!showFull)}
          style={{ color: "var(--primary_color)", cursor: "pointer"}}
        >
          {showFull ? "Show less" : "... Show more"}
        </span>
      )}
    </>
  );
}

export default DescriptionCell;
