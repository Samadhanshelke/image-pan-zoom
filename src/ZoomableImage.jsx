import { useRef, useState } from 'react';

const ZoomableImage = ({ img }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [initialTouchPosition, setInitialTouchPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const distance = getDistance(event.touches[0], event.touches[1]);
      setInitialTouchPosition(null); // Reset single touch position when two touches detected
      setInitialPosition(null); // Reset single touch initial position
      setZoom((prevZoom) => Math.max(1, Math.min(prevZoom * 2, 3))); // Zoom in on two touches
    } else if (event.touches.length === 1) {
      setInitialTouchPosition({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      });
      setInitialPosition({
        x: imgRef.current.offsetLeft,
        y: imgRef.current.offsetTop,
      });
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - initialTouchPosition.x;
      const deltaY = event.touches[0].clientY - initialTouchPosition.y;
      const container = containerRef.current;
      const img = imgRef.current;

      if (container && img) {
        const imgRect = img.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        let newX = initialPosition.x + deltaX;
        let newY = initialPosition.y + deltaY;

        const maxTranslateX = (imgRect.width * zoom - containerRect.width) / 2;
        const maxTranslateY = (imgRect.height * zoom - containerRect.height) / 2;

        newX = Math.min(Math.max(newX, -maxTranslateX), maxTranslateX);
        newY = Math.min(Math.max(newY, -maxTranslateY), maxTranslateY);

        img.style.transform = `scale(${zoom}) translate(${newX}px, ${newY}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    setInitialTouchPosition(null);
    setInitialPosition(null);
  };

  const getDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid red',
  };

  const imgStyle = {
    position: 'absolute',
    maxWidth: 'none',
    maxHeight: 'none',
    top: 0,
    left: 0,
    transformOrigin: 'top left',
    transition: 'transform 0.2s',
  };

  return (
    <main>
      <div
        ref={containerRef}
        style={containerStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef}
          src={img}
          alt="Zoomable"
          style={imgStyle}
        />
      </div>
    </main>
  );
};

export default ZoomableImage;
