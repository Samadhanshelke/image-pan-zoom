import './App.css'
import ZoomableImage from './ZoomableImage'
import img from './img.webp'
const App = () => {
  return (
    <div className="App" >
      <ZoomableImage img={img}/>
    </div>
  );
};

export default App;


// import React, { useRef, useState } from 'react';
// import imageUrl from './pexels-jckulkarni-910213.jpg'; // Update with your image URL

// const App = () => {
//     const canvasRef = useRef(null);
//     const imageRef = useRef(null);
//     const text = 'Hello, world!'; // Update with your desired text
//     const [imageLoaded, setImageLoaded] = useState(false);

//     const handleImageLoad = () => {
//         setImageLoaded(true);
//     };

//     const handleDownload = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');

//         // Clear previous content
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Draw image onto canvas
//         ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

//         // Draw text onto canvas
//         ctx.font = '30px Arial';
//         ctx.fillStyle = 'black';
//         ctx.fillText(text, 50, 50); // Adjust position as needed

//         // Generate data URL and initiate download
//         const url = canvas.toDataURL('image/jpeg'); // Change format as needed
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'image-with-text.jpg'; // Set desired filename
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div>
//             <canvas ref={canvasRef} width={800} height={600} style={{ display: 'none' }} />
//             <img
//                 ref={imageRef}
//                 src={imageUrl}
//                 alt="Loaded Image"
//                 style={{ display: 'none' }}
//                 onLoad={handleImageLoad}
//             />
         
//                 <button onClick={handleDownload}>Download Image</button>
            
//         </div>
//     );
// };

// export default App;


// src/VideoOverlay.js
// import  { useRef, useEffect, useState } from 'react';
// import { Stage, Layer, Text } from 'react-konva';
// import video from './video.mp4'
// const App = () => {
//   const videoRef = useRef(null);
//   const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     const video = videoRef.current;
//     video.addEventListener('loadedmetadata', () => {
//       setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
//     });
//   }, []);

//   return (
//     <div style={{ position: 'relative', display: 'inline-block' }}>
//       <video ref={videoRef} width="600" controls>
//         <source src={video} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <Stage width={videoDimensions.width} height={videoDimensions.height} style={{ position: 'absolute', top: 0, left: 0 }}>
//         <Layer>
//           <Text
//             text="Your Text Here"
//             fontSize={24}
//             fill="white"
//             x={100} // Adjust these values to position the text on the bag
//             y={100} // Adjust these values to position the text on the bag
//           />
//         </Layer>
//       </Stage>
//     </div>
//   );
// };

// export default App;