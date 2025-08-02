import React from 'react';
import ThreeModel from './ThreeModel';
import './HeroSection.css';

import samosaModel from '/models/samosa.glb?url';
import soupModel from '/models/soup.glb?url';
import burgerModel from '/models/burger2.glb?url';

const HeroSection = () => {
  return (
    <section className="heroSection" id="heroSection">
      <div className="container">
        <div className="heroIntro">
          <h1 className="heroHeading">
            Experience Your Favorite Indian Dishes in <span>3D</span> 🍽️
          </h1>
          <p className="heroSubtextGlobal">
  You can rotate these — try dragging them now!
</p>

        </div>

        <div className="modelShowcase">
          <div className="modelWrapper samosaSpacing">
            <ThreeModel modelPath={samosaModel} scale={[3, 3, 3]} rotation={[0, 0.4, 0]} />
            <p className="modelLabel">Samosa</p>
          </div>

          <div className="modelWrapper">
            <ThreeModel modelPath={soupModel} scale={[3, 3, 3]} rotation={[0, 0, 0]} />
            <p className="modelLabel">Corn Soup</p>
          </div>

          <div className="modelWrapper burgerFix">
            <ThreeModel modelPath={burgerModel} scale={[4, 4, 4]} rotation={[0, 0.1, 0]} />
            <p className="modelLabel">Veg Cheese Burger</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
