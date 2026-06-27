import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, Type, Palette } from 'lucide-react';

export default function HtmlEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  // Sync value from prop to innerHTML when it changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Prevent cursor jump by checking if the editor is currently focused
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleColorChange = (e) => {
    executeCommand('foreColor', e.target.value);
  };

  const handleFontSizeChange = (e) => {
    // execCommand fontSize expects a value 1-7
    executeCommand('fontSize', e.target.value);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:bg-white focus-within:border-brand-teal transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 text-slate-700 select-none">
        {/* Font Style */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Bullet Points */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          title="Bullet Points"
        >
          <List className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Font Size Dropdown */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <select
            onChange={handleFontSizeChange}
            defaultValue="3"
            className="text-[10px] font-bold text-slate-700 bg-transparent outline-none cursor-pointer border-none"
            title="Font Size"
          >
            <option value="1">Extra Small</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Medium</option>
            <option value="5">Large</option>
            <option value="6">Extra Large</option>
            <option value="7">Heading</option>
          </select>
        </div>

        {/* Text Color Input */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="color"
            onChange={handleColorChange}
            className="w-5 h-4 border-none cursor-pointer outline-none p-0 bg-transparent"
            title="Text Color"
          />
        </div>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[150px] p-4 text-xs text-slate-900 focus:outline-none leading-relaxed bg-transparent rich-text-content"
        placeholder={placeholder}
      />
    </div>
  );
}
