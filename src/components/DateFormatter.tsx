import { useEffect, useState } from "react";

interface FullScreenDateMarginProps {
  fullScreenMargin?: string;
  normalMargin?: string;
}

const useDateFormatterMargin = ({
  fullScreenMargin = "900",
  normalMargin = "28",
}: FullScreenDateMarginProps = {}) => {

  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {

    const handleFs = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFs);

    return () => {
      document.removeEventListener("fullscreenchange", handleFs);
    };

  }, []);

  return isFullScreen ? fullScreenMargin : normalMargin;
};

export default useDateFormatterMargin;
