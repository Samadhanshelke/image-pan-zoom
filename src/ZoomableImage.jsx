import  { useState, useRef } from 'react';
import './App.css';

const ZoomableImage = () => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [lastTouch, setLastTouch] = useState(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prevScale) => Math.max(0.1, prevScale * scaleAmount));
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setLastTouch({ x: touch.pageX, y: touch.pageY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.pageX - lastTouch.x;
      const dy = touch.pageY - lastTouch.y;

      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      const newTranslateX = translate.x + dx;
      const newTranslateY = translate.y + dy;

      // Boundary checks
      const maxTranslateX = (imgRect.width * scale - containerRect.width) / 2;
      const maxTranslateY = (imgRect.height * scale - containerRect.height) / 2;

      setTranslate({
        x: Math.min(Math.max(newTranslateX, -maxTranslateX), maxTranslateX),
        y: Math.min(Math.max(newTranslateY, -maxTranslateY), maxTranslateY),
      });

      setLastTouch({ x: touch.pageX, y: touch.pageY });
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        (touch2.pageX - touch1.pageX) ** 2 + (touch2.pageY - touch1.pageY) ** 2
      );
      if (lastTouch && lastTouch.distance) {
        const scaleAmount = distance / lastTouch.distance;
        setScale((prevScale) => Math.max(0.1, prevScale * scaleAmount));
      }
      setLastTouch({ distance });
    }
  };

  const handleTouchEnd = () => {
    setLastTouch(null);
  };

  return (
    <div
      ref={containerRef}
      className="image-container"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        ref={imgRef}
        src="https://media.gettyimages.com/id/2159010840/photo/kalahari-lion-cub-next-to-its-mother-stretching-in-late-afternoon-light.jpg?s=2048x2048&w=gi&k=20&c=CVMxHYCFZo-C_etZVzwPEIX6sOUjP9w601ULvGjlD9w="
        alt="Zoomable"
        style={{
          transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
          transformOrigin: '0 0',
        }}
      />
    </div>
  );
};



export default ZoomableImage;