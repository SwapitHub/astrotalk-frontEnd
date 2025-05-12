import { useEffect, useState } from "react";

function SlideToggle  ({ isOpen, children }) {
  const [height, setHeight] = useState(0);
  const ref = useState(null);

  useEffect(() => {
    if (isOpen && ref[0]?.scrollHeight) {
      setHeight(ref[0].scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={(el) => (ref[0] = el)}
      style={{
        maxHeight: `${height}px`,
        overflow: "hidden",
        transition: "max-height 0.6s ease",
      }}
    >
      {children}
    </div>
  );
};

export default SlideToggle;