import React from "react";
import { Box, Container } from "@mui/material";

export default function Statistics() {
  return (
    <div className={"static-frame"}>
      <Container>
        {/* Left side - Title and Description */}
        <div className="stats-content">
          <h2 className="stats-title">Our Statatics</h2>
          <p className="stats-description">
            We help you to choose any the best outputs
          </p>
        </div>

        {/* Right side - Statistics Grid */}
        <div className="stats-grid">
          <div className="static-box">
            <h2>12</h2>
            <p>Brand Stores</p>
          </div>

          <div className="static-box">
            <h2>8</h2>
            <p>Experience</p>
          </div>

          <div className="static-box">
            <h2>50+</h2>
            <p>Menu</p>
          </div>

          <div className="static-box">
            <h2>200+</h2>
            <p>Stores</p>
          </div>
        </div>
      </Container>
    </div>
  )
}