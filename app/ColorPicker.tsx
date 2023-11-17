import React, { useState, useRef } from "react";

function GradientBox({
  baseColor,
  selectColor,
  color,
  setSaturation,
  setValue,
}) {
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const gradientBoxRef = useRef(null);
  const updateColor = (event) => {
    if (gradientBoxRef) {
      const { width, height, top, left } =
        gradientBoxRef.current.getBoundingClientRect();
      let x = (event.clientX - left) / width;
      let y = (event.clientY - top) / height;
      y = 1 - y;
      // Clamp x and y within [0, 1]
      x = Math.max(0, Math.min(x, 1));
      console.log(x);
      y = Math.max(0, Math.min(y, 1));
      const saturation = x;
      const value = y;
      setSaturation(saturation);
      setValue(value);
      selectColor(saturation, value);
      setSelectedPosition({ x: x * width, y: (1 - y) * height });
    }
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    updateColor(event);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      updateColor(event);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const gradientStyle = {
    background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, ${baseColor})`,
    height: "200px",
    width: "200px",
  };

  return (
    <div
      ref={gradientBoxRef}
      style={gradientStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="custom-cursor"
    >
      {selectedPosition && (
        <div
          style={{
            position: "absolute",
            left: `${selectedPosition.x - 5}px`,
            top: `${selectedPosition.y - 5}px`,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: `rgb(${color.r},${color.g}, ${color.b})`,
            border: "1px solid white",
          }}
        ></div>
      )}
    </div>
  );
}

const ColorSlider = ({ onSelectBaseColor }) => {
  const handleSliderChange = (event) => {
    onSelectBaseColor(360 - event.target.value);
  };
  return (
    <>
      <input
        type="range"
        orient="vertical"
        min="0"
        max="360"
        className="color-slider"
        onChange={handleSliderChange}
      />
    </>
  );
};

function hsvToRgb(h, s, v) {
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

const ColorPicker = () => {
  const [baseColor, setBaseColor] = useState("hsl(0,100%,50%)");
  const [color, setColor] = useState({ r: 255, g: 0, b: 0, a: 1 });
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [value, setValue] = useState(1);

  const selectBaseColor = (hue) => {
    // need to use hsl color for base since it's parsing css
    const hslColor = `hsl(${hue}, 100%, 50%)`;
    setBaseColor(hslColor);

    setHue(hue);
    const rgb = hsvToRgb(hue / 360, saturation, value);
    setColor({ r: rgb.r, g: rgb.g, b: rgb.b, a: color.a });
  };

  const selectColor = (saturation, value) => {
    const hue = parseInt(baseColor.match(/\d+/)[0]); // Extract hue from baseColor
    const rgb = hsvToRgb(hue / 360, saturation, value);
    setColor({ r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <GradientBox
        baseColor={baseColor}
        selectColor={selectColor}
        color={color}
        setSaturation={setSaturation}
        setValue={setValue}
      />
      <ColorSlider onSelectBaseColor={selectBaseColor} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div
          className="color-display"
          style={{
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          }}
        ></div>
        <div>
          R:
          <input className="rgba-inputs" type="text" value={color.r} readOnly />
        </div>
        <div>
          G:
          <input className="rgba-inputs" type="text" value={color.g} readOnly />
        </div>
        <div>
          B:
          <input className="rgba-inputs" type="text" value={color.b} readOnly />
        </div>
        <div>
          a:
          <input className="rgba-inputs" type="text" value={color.a} readOnly />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
