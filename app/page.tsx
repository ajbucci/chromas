'use client';

import React, { useState, useRef } from 'react';

const adjustColor = (color, amount) => {
    let [r, g, b] = color.match(/\w\w/g).map((c) => parseInt(c, 16));
    [r, g, b] = [r, g, b].map(c => Math.min(255, Math.max(0, c + amount)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const interpolateColors = (color1, color2, steps) => {
    let [r1, g1, b1] = color1.match(/\w\w/g).map((c) => parseInt(c, 16));
    let [r2, g2, b2] = color2.match(/\w\w/g).map((c) => parseInt(c, 16));

    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];

    for (let i = 0; i < steps; i++) {
        interpolatedColorArray.push(`#${Math.round(r1 + (r2 - r1) * stepFactor * i).toString(16).padStart(2, '0')}${Math.round(g1 + (g2 - g1) * stepFactor * i).toString(16).padStart(2, '0')}${Math.round(b1 + (b2 - b1) * stepFactor * i).toString(16).padStart(2, '0')}`);
    }

    return interpolatedColorArray;
};

const ColorBox = ({ color, onClick, onLock, isLocked }) => (
    <div onClick={() => onClick(color)} onContextMenu={(e) => { e.preventDefault(); onLock(color); }} style={{ backgroundColor: color, color: '#fff', padding: '10px', margin: '5px', border: isLocked ? '2px solid black' : 'none', cursor: 'pointer' }}>
        {color}
    </div>
);

const GradientColorPicker = ({ onSelectColor }) => {
  const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const gradientRef = useRef();

  const handleGradientClick = (event) => {
      const bounds = gradientRef.current.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const width = bounds.width;
      const height = bounds.height;

      // Simplified color calculation
      const r = Math.round((x / width) * 255);
      const g = Math.round((y / height) * 255);
      const b = 255 - r;
      const a = 1; // Alpha is always 1 in this basic version

      const newColor = { r, g, b, a };
      setColor(newColor);
      onSelectColor(`rgba(${r},${g},${b},${a})`);
  };

  return (
      <div>
          <div 
              ref={gradientRef} 
              onClick={handleGradientClick} 
              style={{ width: '300px', height: '200px', background: 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red), linear-gradient(to top, black, transparent, white)' }}
          ></div>
          <div>
              R: <input type="text" value={color.r} readOnly />
              G: <input type="text" value={color.g} readOnly />
              B: <input type="text" value={color.b} readOnly />
              A: <input type="text" value={color.a} readOnly />
          </div>
      </div>
  );
};
import ColorPicker from './ColorPicker';
const App = () => {
    const [primary500, setPrimary500] = useState('#ff5347');
    const [gray500, setGray500] = useState('#8c8c8c');
    const [accent500, setAccent500] = useState('#4b6dca');
    const [lockedColors, setLockedColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);

    const generatePalette = (baseColor, isLocked) => {
        const lightest = adjustColor(baseColor, 160);
        const darkest = adjustColor(baseColor, -160);
        const lightShades = interpolateColors(lightest, baseColor, 3);
        const darkShades = interpolateColors(baseColor, darkest, 3);
        return [...lightShades, baseColor, ...darkShades.slice(1)].map(color => ({ color, isLocked: isLocked.includes(color) }));
    };

    const primaryPalette = generatePalette(primary500, lockedColors);
    const grayPalette = generatePalette(gray500, lockedColors);
    const accentPalette = generatePalette(accent500, lockedColors);

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleLockColor = (color) => {
        setLockedColors(lockedColors.includes(color) ? lockedColors.filter(c => c !== color) : [...lockedColors, color]);
    };

    const handleSelectColor = (color) => {
        if (!selectedColor) return;
        if (selectedColor === primary500) setPrimary500(color);
        else if (selectedColor === gray500) setGray500(color);
        else if (selectedColor === accent500) setAccent500(color);
    };

    return (
      <>
      <div>
        <ColorPicker />
      </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GradientColorPicker onSelectColor={handleSelectColor} />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div>
                    <h2>Primary Palette</h2>
                    {primaryPalette.map(({ color, isLocked }, index) => <ColorBox key={index} color={color} onClick={handleColorClick} onLock={handleLockColor} isLocked={isLocked} />)}
                </div>
                <div>
                    <h2>Gray Palette</h2>
                    {grayPalette.map(({ color, isLocked }, index) => <ColorBox key={index} color={color} onClick={handleColorClick} onLock={handleLockColor} isLocked={isLocked} />)}
                </div>
                <div>
                    <h2>Accent Palette</h2>
                    {accentPalette.map(({ color, isLocked }, index) => <ColorBox key={index} color={color} onClick={handleColorClick} onLock={handleLockColor} isLocked={isLocked} />)}
                </div>
            </div>
        </div>
        </>
    );
};

export default App;
