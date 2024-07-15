import  { useRef, useState, useEffect } from 'react';
import './App.css'; // Assuming you have the styles in App.css

const ZoomableImage = () => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [imgDimensions, setImgDimensions] = useState({ width: 500, height: 500 });
  const [currentPosition, setCurrentPosition] = useState({ top: 0, left: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);

  useEffect(() => {
    const img = imgRef.current;
    const origWidth = img.getBoundingClientRect().width;
    const origHeight = img.getBoundingClientRect().height;

    setImgDimensions({ width: origWidth, height: origHeight });
  }, []);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const newLeft = touch.clientX - imgDimensions.width / 2;
      const newTop = touch.clientY - imgDimensions.height / 2;

      setCurrentPosition({ top: newTop, left: newLeft });
      imgRef.current.style.left = `${newLeft}px`;
      imgRef.current.style.top = `${newTop}px`;
    } else if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      const zoomincrement = (distance - initialPinchDistance) / 200; // Adjust sensitivity
      setZoomFactor((prev) => {
        let newZoomFactor = prev + zoomincrement;
        if (newZoomFactor <= 1.0) {
          newZoomFactor = 1.0;
          setCurrentPosition({ top: 0, left: 0 });
        }

        const newWidth = imgDimensions.width * newZoomFactor;
        const newHeight = imgDimensions.height * newZoomFactor;

        if (currentPosition.left < imgDimensions.width - newWidth) {
          setCurrentPosition((prev) => ({ ...prev, left: imgDimensions.width - newWidth }));
        }
        if (currentPosition.top < imgDimensions.height - newHeight) {
          setCurrentPosition((prev) => ({ ...prev, top: imgDimensions.height - newHeight }));
        }

        imgRef.current.style.width = `${newWidth}px`;
        imgRef.current.style.height = `${newHeight}px`;
        imgRef.current.style.left = `${currentPosition.left}px`;
        imgRef.current.style.top = `${currentPosition.top}px`;

        return newZoomFactor;
      });
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setInitialPinchDistance(null);
  };

  const getDistance = (touches) => {
    const [touch1, touch2] = touches;
    return Math.sqrt(
      (touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2
    );
  };

  return (
    <div id="fullbody">
      <div
        id="zoom-container"
        ref={containerRef}
        style={{ overflow: 'hidden', background: 'red', height: '300px', width: '300px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          onDragStart={(e) => e.preventDefault()}
          id="zoom-img"
          ref={imgRef}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cordillera_de_los_Andes.jpg/1024px-Cordillera_de_los_Andes.jpg"
          style={{
            cursor: 'move',
            position: 'relative',
            width: '300px',
            height: '300px',
            padding:'10px'
          }}
        />
      </div>
    </div>
  );
};

export default ZoomableImage;
