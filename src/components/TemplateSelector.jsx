// components/TemplateSelector.jsx
import React from "react";
import { FaColumns } from "react-icons/fa";

const fonts = ["Poppins", "Roboto", "Open Sans", "Lato"];
const fontSizes = ["S", "M", "L"];
const lineHeights = [1, 1.25, 1.5];
const colors = ["#000000", "#1e40af", "#16a34a", "#dc2626"];

export default function TemplateSelector({ selected, setSelected, onSelect }) {

 

  return (
    <div >
      <div  >
        {/* Template Dropdown */}
        <div className="flex items-center gap-1 mt-5">
          {/* <FaColumns className="text-gray-500" /> */}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="templateOne">Template 1</option>
            <option value="templateTwo">Template 2</option>
            <option value="templateThree">Template 3</option>
          </select>
        </div>

        {/* Font Family */}
        {/* <select className="border px-2 py-1 rounded text-sm">
          {fonts.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select> */}

        {/* Font Size */}
        {/* <select className="border px-2 py-1 rounded text-sm">
          {fontSizes.map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select> */}

        {/* Line Height */}
        {/* <select className="border px-2 py-1 rounded text-sm">
          {lineHeights.map((lh) => (
            <option key={lh}>{lh}</option>
          ))}
        </select> */}

        {/* Font Color */}
        {/* <select className="border px-2 py-1 rounded text-sm">
          {colors.map((color) => (
            <option key={color} value={color} style={{ color }}>{color}</option>
          ))}
        </select> */}

        {/* Fullscreen (placeholder button) */}
        {/* <button className="ml-auto text-sm px-3 py-1 border rounded">⛶</button> */}
      </div>
    </div>
  );
}
