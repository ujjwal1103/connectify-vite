import React, { useState } from 'react';

interface TextEditorProps {
  onAddText: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onAddText }) => {
  const [text, setText] = useState('');

  const handleAddText = () => {
    onAddText(text);
    setText('');
  };

  return (
    <div className="text-editor">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add text"
      />
      <button onClick={handleAddText}>Add Text</button>
    </div>
  );
};

export default TextEditor;
