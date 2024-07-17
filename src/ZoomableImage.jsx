import { useEffect, useRef, useState } from 'react';

const ZoomableImage = ({ img }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [initialTouchPosition, setInitialTouchPosition] = useState({ x: 0, y: 0 });
  const [lastTouchEnd, setLastTouchEnd] = useState(0);

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const distance = getDistance(event.touches[0], event.touches[1]);
      setInitialDistance(distance);
    } else if (event.touches.length === 1) {
      setInitialTouchPosition({ x: event.touches[0].clientX, y: event.touches[0].clientY });
      setInitialPosition(position);
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      const currentDistance = getDistance(event.touches[0], event.touches[1]);
      if (initialDistance) {
        const scale = currentDistance / initialDistance;
        const newZoom = Math.max(1, Math.min(zoom * scale, 3));
        setZoom(newZoom);
      }
    } else if (event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - initialTouchPosition.x;
      const deltaY = event.touches[0].clientY - initialTouchPosition.y;
      const container = containerRef.current;
      const img = imgRef.current;

      if (container && img) {
        const containerRect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        let newX = initialPosition.x + deltaX;
        let newY = initialPosition.y + deltaY;

        // Calculate boundaries
        const maxOffsetX = Math.max(0, (imgRect.width * zoom - containerRect.width) / 8);
        const maxOffsetY = Math.max(0, (imgRect.height * zoom - containerRect.height) / 8);

        // Ensure the image stays within the container
        newX = Math.max(-maxOffsetX, Math.min(newX, maxOffsetX));
        newY = Math.max(-maxOffsetY, Math.min(newY, maxOffsetY));

        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleTouchEnd = () => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      // handleDoubleTap(event);
    }
    setLastTouchEnd(now);
    setInitialDistance(null);
  };

  // const handleDoubleTap = (event) => {
  //   if (zoom === 1) {
  //     setZoom(2);
  //   } else {
  //     setZoom(1);
  //     setPosition({ x: 0, y: 0 });
  //   }
  // };

  const getDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '350px',
    height: '350px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid red',
  };

  const imgStyle = {
    position: 'absolute',
    maxWidth: 'none',
    maxHeight: 'none',
    width: '100%',
    height: '100%',
    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    transformOrigin: 'center center',
    transition: 'transform 0.2s',
  };

  // const handleZoomIn = () => {
  //   const newZoom = Math.min(zoom + 0.5, 3);
  //   setZoom(newZoom);
  // };

  // const handleZoomOut = () => {
  //   setZoom((prevZoom) => Math.max(1, prevZoom - 0.5));
  // };

  useEffect(() => {
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

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
      {/* <div className="flex gap-4 mt-4 ms-8">
        <button className="bg-white text-black p-2" onClick={handleZoomIn}>Zoom In</button>
        <button className="bg-white text-black p-2" onClick={handleZoomOut}>Zoom Out</button>
      </div> */}
    </main>
  );
};

export default ZoomableImage;
