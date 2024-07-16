import { useEffect, useRef, useState } from 'react';
import img from './pexels-jckulkarni-910213.jpg'
const ZoomableImage = () => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [initialTouchPosition, setInitialTouchPosition] = useState({ x: 0, y: 0 });

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
        setZoom((prevZoom) => Math.max(1, Math.min(prevZoom * scale, 3)));
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

        // Calculate the boundaries
        const maxLeft = containerRect.width - imgRect.width * zoom;
        const maxTop = containerRect.height - imgRect.height * zoom ;
        // console.log('newX',newX)
        // console.log('newY',newY)
        console.log('maxLeft',maxLeft)
        // console.log('maxTop',maxTop)

       console.log(imgRect.width,containerRect.width)
       console.log(newX)
       if(zoom === 1){
        newX = 0
        newY = 0
       }
       if(zoom > 1 && zoom <= 2 ){
           if( newX < -85){
            newX = -80
           }else if(newX > 85){
            newX = 80
           }
       }

       if(zoom > 2 && zoom <= 3 ){
        if( newX < -100){
         newX = -100
        }else if(newX > 100){
         newX = 100
        }
    }



        
        // Ensure the image stays within the container
        // newX = Math.min(0, Math.max(newX, maxLeft));
        // newY = Math.min(0, Math.max(newY, maxTop));
      
        setPosition({ x: newX, y: newY });
      }
    }
  };
  const handleTouchEnd = () => {
    setInitialDistance(null);
  };

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
    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
    transformOrigin: 'center center',
    transition: 'transform 0.2s',
  };

  const handleZoomIn = () => {
   setZoom((pre)=>{
    return pre + 1
   })
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom * 0.9, 1));
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
          src={'https://imgs.search.brave.com/4uldFdZO5-L20VuZb5wkXP9AGXhscn3hi92hlz_6Lb4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXN0b2NrcGhvdG8u/Y29tL3Jlc291cmNl/cy9pbWFnZXMvRnJl/ZVBob3Rvcy9GcmVl/LVBob3RvLTc0MHg0/OTItMjE1NDU1Njgy/OC5qcGc'}
          alt="Zoomable"
          style={imgStyle}
        />
      </div>
      <div className='flex gap-4 mt-4 ms-8'>
        <button className='bg-white text-black p-2' onClick={handleZoomIn}> Zoom In </button>
        <button className='bg-white text-black p-2' onClick={handleZoomOut}> Zoom Out </button>
      </div>
    </main>
  );
};

export default ZoomableImage;