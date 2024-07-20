import React, { useState, useRef } from 'react';

const RichTextEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
    setContent(event.target.textContent || '');
  };

  const handleBold = () => {
    document.execCommand('bold');
  };

  const handleItalic = () => {
    document.execCommand('italic');
  };

  const handleUnderline = () => {
    document.execCommand('underline');
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  return (
    <div>
      <div
        contentEditable
        ref={editorRef}
        style={{ border: '1px solid black', minHeight: '100px', padding: '5px', }}
        onInput={handleChange}
      >
        {content}
      </div>
      <button onClick={handleBold}>Bold</button>
      <button onClick={handleItalic}>Italic</button>
      <button onClick={handleUnderline}>Underline</button>
      <button onClick={handleLink}>Link</button>
    </div>
  );
};

export default RichTextEditor;
