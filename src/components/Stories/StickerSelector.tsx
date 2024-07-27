import React from 'react';

interface StickerSelectorProps {
  onSelect: (sticker: string) => void;
}

const StickerSelector: React.FC<StickerSelectorProps> = ({ onSelect }) => {
  const stickers = ['🐱', '🌟', '🎉', '❤️']; // Example stickers

  return (
    <div className="sticker-selector">
      {stickers.map((sticker, index) => (
        <button key={index} onClick={() => onSelect(sticker)}>
          {sticker}
        </button>
      ))}
    </div>
  );
};

export default StickerSelector;
