"use client";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ value, onChange }) => {
  return (
    <div className="text-editor-main">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TEXT_EDITOR_KEY}
        // initialValue={value}
        value={value} // make it controlled
        init={{
          height: 300,
          menubar: false,
          plugins: ['code', 'link', 'lists', 'image', 'preview'],
          toolbar:
            'h1 h2 h3 | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | outdent indent | code preview',
            
        }}
        onEditorChange={(newContent) => onChange(newContent)}
      />
    </div>
  );
};

export default TextEditor;
