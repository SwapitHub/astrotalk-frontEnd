"use client";
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ value, onChange }) => {
  return (
    <div className="text-editor-main">
      <Editor
        // apiKey={process.env.NEXT_PUBLIC_TEXT_EDITOR_KEY}
        // initialValue={value}
        value={value} // make it controlled
        init={{
          height: 300,
          menubar: false,
          selector: "textarea",
          plugins: [
            // Core editing features
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",

            "visualblocks",

            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Aug 13, 2025:
            "checklist",
            "mediaembed",
            "casechange",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
          ],
          toolbar:
            "undo redo | blocks  fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments |  align lineheight | checklist numlist bullist indent outdent ",
        }}
        onEditorChange={(newContent) => onChange(newContent)}
      />
    </div>
  );
};

export default TextEditor;
