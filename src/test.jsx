import { useEffect, useRef, useState } from 'react';

const ZoomableImage = ({ img }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const zoomRef = useRef(1);
  const initialDistanceRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const initialTouchPositionRef = useRef({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);

  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected
        handleDoubleTap();
      } else {
        initialTouchPositionRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        initialPositionRef.current = positionRef.current;
      }
      setLastTap(currentTime);
    } else if (event.touches.length === 2) {
      const distance = getDistance(event.touches[0], event.touches[1]);
      initialDistanceRef.current = distance;
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
        const maxX = Math.max(0, (imgRect.width * zoomRef.current - containerRect.width)/25);
        const maxY = Math.max(0, (imgRect.height * zoomRef.current - containerRect.height)/25);
        // Ensure the image stays within the container
        newX = Math.max(-maxX, Math.min(newX, maxX));
        newY = Math.max(-maxY, Math.min(newY, maxY));
        positionRef.current = { x: newX, y: newY };
        updateImageTransform();
      }
    }
  };

  const handleTouchEnd = () => {
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
      if (zoomRef.current === 1) {
        img.style.transform = 'none';
        img.style.width = '100%';
        img.style.height = '100%';
        positionRef.current = { x: 0, y: 0 };
      } else {
        img.style.transform = `scale(${zoomRef.current}) translate(${positionRef.current.x }px, ${positionRef.current.y }px)`;
      }
    }
  };

  const handleDoubleTap = () => {
    if (zoomRef.current === 1) {
      zoomRef.current = 3; // Zoom in
    } else {
      zoomRef.current = 1; // Zoom out
    }
    updateImageTransform();
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '340px',
    height: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // border: '4px solid red',
  };

  const imgStyle = {
    position: 'absolute',
    maxWidth: 'none',
    maxHeight: 'none',
    width: '100%',
    // transform: `scale(${zoomRef.current}) translate(${positionRef.current.x }px, ${positionRef.current.y}px)`,
    height: '100%',
    transformOrigin: 'center center',
    transition: 'transform 0.2s',
  };

  useEffect(() => {
    if (zoomRef.current <= 1) {
      positionRef.current = { x: 0, y: 0 };
      updateImageTransform();
    }
  }, [zoomRef.current]);

  // const handleZoomIn = () => {
  //   zoomRef.current = zoomRef.current + 0.2;
  //   updateImageTransform();
  // };

  // const handleZoomOut = () => {
  //   zoomRef.current = zoomRef.current - 0.2;
  //   updateImageTransform();
  // };

  return (
    <main>
      <div
        ref={containerRef}
        style={containerStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img ref={imgRef} src={img} alt="Zoomable" style={imgStyle} />
      </div>
      
    </main>
  );
};

export default ZoomableImage;