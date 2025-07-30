"use client";
import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({setContent, content}) => {

  return (
    <div className="text-editor-main">
      <h2>Create Post</h2>
      <Editor
        apiKey="kpqq505a0mmv0d18kt4d44ykv02w98wrl8ojl272ue8ryafb" // Optional — works without it
        initialValue={content}
        init={{
          height: 300,
          menubar: false,
          plugins: ['code', 'link', 'lists', 'image'],
          toolbar:   'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | outdent indent | code preview',         
        
        }}
        onEditorChange={(newContent) => setContent(newContent)}
      />
      {/* <button onClick={() => console.log(content)}>Submit</button> */}
    </div>
  );
};

export default TextEditor;
