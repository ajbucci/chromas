import React, { useState } from "react";

function GradientBox({baseColor, onSelectColor, color, setSaturation, setValue}) {
  const [selectedPosition, setSelectedPosition] = useState({x: 0, y: 0});
  const hue = parseInt(baseColor.match(/\d+/)[0]); // Extract hue from baseColor
  const complement = hue > 180 ? hue - 180 : hue + 180;
  console.log(complement);
  const handleClick = (event) => {
    const { width, height, top, left } = event.target.getBoundingClientRect();
    const x = (event.clientX - left) / width;
    const y = (height - (event.clientY - top)) / height;
    const saturation = x;
    const value = y;
    setSaturation(saturation);
    setValue(value);
    onSelectColor(saturation, value);
    setSelectedPosition({x: event.clientX - left, y: event.clientY - top});
  };
  const gradientStyle = {
    background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, ${baseColor})`,
    height: "200px",
    width: "200px",
};
  return (
    <>
        <div style={gradientStyle} onClick={handleClick} className="custom-cursor">
        {(selectedPosition &&
            <div style={{
                position: 'absolute',
                left: `${selectedPosition.x-5}px`,
                top: `${selectedPosition.y-5}px`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: `rgb(${color.r},${color.g}, ${color.b})`,
                border: '1px solid white',
            }}></div>
        )}
        </div>
    </>
  );
    
};

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
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

const ColorPicker = () => {
  const [baseColor, setBaseColor] = useState('hsl(0,100%,50%)');
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
    setColor({r: rgb.r, g: rgb.g, b: rgb.b, a: color.a});
  };

  const selectColor = (saturation, value) => {
    const hue = parseInt(baseColor.match(/\d+/)[0]); // Extract hue from baseColor
    const rgb = hsvToRgb(hue / 360, saturation, value);
    setColor({ r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <GradientBox baseColor={baseColor} onSelectColor={selectColor} color={color} setSaturation={setSaturation} setValue={setValue}/>
      <ColorSlider onSelectBaseColor={selectBaseColor} />
      <div>
        <div className='color-display' style={{backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}}></div>
        <div>
          R:
          <input
            className="rgba-inputs"
            type="text"
            value={color.r}
            readOnly
          />
        </div>
        <div>
          G:
          <input
            className="rgba-inputs"
            type="text"
            value={color.g}
            readOnly
          />
        </div>
        <div>
          B:
          <input
            className="rgba-inputs"
            type="text"
            value={color.b}
            readOnly
          />
        </div>
        <div>
          a:
          <input
            className="rgba-inputs"
            type="text"
            value={color.a}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
