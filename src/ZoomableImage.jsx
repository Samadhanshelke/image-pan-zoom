import { useEffect, useRef } from 'react';

const ZoomableImage = ({ img }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const zoomRef = useRef(1);
  const initialDistanceRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const initialTouchPositionRef = useRef({ x: 0, y: 0 });
  const lastTouchEndRef = useRef(0);

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const distance = getDistance(event.touches[0], event.touches[1]);
      initialDistanceRef.current = distance;
    } else if (event.touches.length === 1) {
      initialTouchPositionRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      initialPositionRef.current = positionRef.current;
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      const currentDistance = getDistance(event.touches[0], event.touches[1]);
      if (initialDistanceRef.current) {
        const scale = currentDistance / initialDistanceRef.current;
        const newZoom = Math.max(1, Math.min(zoomRef.current * scale, 3));
        zoomRef.current = newZoom;
        updateImageTransform();
      }
    } else if (event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - initialTouchPositionRef.current.x;
      const deltaY = event.touches[0].clientY - initialTouchPositionRef.current.y;
      const container = containerRef.current;
      const img = imgRef.current;

      if (container && img) {
        const containerRect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        let newX = initialPositionRef.current.x + deltaX;
        let newY = initialPositionRef.current.y + deltaY;

        // Calculate boundaries
        const maxOffsetX = Math.max(0, (imgRect.width * zoomRef.current - containerRect.width) / 8);
        const maxOffsetY = Math.max(0, (imgRect.height * zoomRef.current - containerRect.height) / 8);

        // Ensure the image stays within the container
        newX = Math.max(-maxOffsetX, Math.min(newX, maxOffsetX));
        newY = Math.max(-maxOffsetY, Math.min(newY, maxOffsetY));

        positionRef.current = { x: newX, y: newY };
        updateImageTransform();
      }
    }
  };

  const handleTouchEnd = () => {
    const now = new Date().getTime();
    if (now - lastTouchEndRef.current <= 300) {
      // handleDoubleTap(event);
    }
    lastTouchEndRef.current = now;
    initialDistanceRef.current = null;
  };

  const getDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const updateImageTransform = () => {
    const img = imgRef.current;
    if (img) {
      img.style.transform = `scale(${zoomRef.current}) translate(${positionRef.current.x / zoomRef.current}px, ${positionRef.current.y / zoomRef.current}px)`;
    }
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '295px',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid pink',
  };

  const imgStyle = {
    position: 'absolute',
    maxWidth: 'none',
    maxHeight: 'none',
    width: '100%',
    height: '100%',
    transformOrigin: 'center center',
    transition: 'transform 0.2s',
  };

  useEffect(() => {
    if (zoomRef.current === 1) {
      positionRef.current = { x: 0, y: 0 };
      updateImageTransform();
    }
  }, [zoomRef.current]);

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
