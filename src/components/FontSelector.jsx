import { useState } from "react";

const FontSelector = ({ fonts, selectedFont, onSelect }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredFonts = fonts.filter((font) =>
    font.family.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-64">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="フォントを検索..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)} // 選択後すぐ消えないように
      />
      {isOpen && (
        <ul className="absolute z-10 w-full max-h-40 overflow-auto bg-white border rounded shadow">
          {filteredFonts.length > 0 ? (
            filteredFonts.map((font) => (
              <li
                key={font.family}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  onSelect(font);
                  setQuery(font.family);
                  setIsOpen(false);
                }}
              >
                {font.family}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-400">該当フォントなし</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default FontSelector;
