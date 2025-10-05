import React from "react";
export default function Advertisement() {
  return (
    <div className="ads-restaurant-frame"> 
    <video
      className={"ads-video"}
      autoPlay={true}
      loop
      muted
      playsInline
      data-video-media=""
    >
      <source type="video/mp4" src="video/8306452-uhd_4096_2160_25fps.mp4"/>
    </video>
    </div>
  );
}