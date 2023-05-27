import React, { useState } from "react";

const TempUnitSlider = ({defaultUnit, onUnitChange}) => {
  const [selectedUnit, setSelectedUnit] = useState("C");

  const handleSliderChange = (event) => {
    const unit = event.target.value;
    onUnitChange(unit);
  };

  return (
    <div>
      <label>
        Celsius
        <input
          type="radio"
          value="C"
          checked={defaultUnit === "C"}
          onChange={handleSliderChange}
        />
      </label>
      <label>
        Fahrenheit
        <input
          type="radio"
          value="F"
          checked={defaultUnit === "F"}
          onChange={handleSliderChange}
        />
      </label>
    </div>
  );
};

export default TempUnitSlider;