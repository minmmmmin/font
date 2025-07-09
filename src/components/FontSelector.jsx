const FontSelector = ({ fonts, selectedFont, onSelect }) => {
  return (
    <select
      className="mb-4 p-2 border rounded"
      value={selectedFont.family}
      onChange={(e) => onSelect(fonts.find((f) => f.family === e.target.value))}
    >
      {fonts.map((font) => (
        <option key={font.family} value={font.family}>
          {font.family}
        </option>
      ))}
    </select>
  );
};

export default FontSelector;
