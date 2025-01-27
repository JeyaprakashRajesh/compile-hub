import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react';

export default function Monoco(props) {
  const monacoRef = useRef(null);
  


  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = editor;
    editor.setPosition({ lineNumber: 2, column: 1 });

    editor.revealLine(2);
    editor.focus();
  };

  return (
    <Editor
      theme={props.theme === "dark" ? "vs-dark" : "light"}
      language={props.language}
      defaultValue="//start coding"
      onMount={handleEditorDidMount} 
      value={props.code}
      onChange={(value) => {props.setCode(value)}}
    />
  );
}
