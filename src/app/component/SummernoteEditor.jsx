'use client';

import { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

const SummernoteEditor = ({ value = '', onChange }) => {
  const editorRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!initialized.current) {
      $(editorRef.current).summernote({
        placeholder: 'Write content...',
        tabsize: 2,
        height: 300,
        focus: true,
        codeviewFilter: false,
        codeviewIframeFilter: true,

        // 🌐 FULL HTML Toolbar
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['view', ['fullscreen', 'codeview', ]],
        ],

        // Allow all HTML tags
        styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'div'],
        fontSizes: ['8', '10', '12', '14', '16', '18', '24', '36'],

        callbacks: {
          onChange: function(contents) {
            if (onChange) onChange(contents);
          },
        },
      });

      initialized.current = true;
    }

    // Set initial content
    $(editorRef.current).summernote('code', value);

    return () => {
      if ($(editorRef.current).next().hasClass('note-editor')) {
        $(editorRef.current).summernote('destroy');
        initialized.current = false;
      }
    };
  }, []);

  // 🔄 Update content if `value` changes from parent
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      initialized.current &&
      $(editorRef.current).summernote('code') !== value
    ) {
      $(editorRef.current).summernote('code', value);
    }
  }, [value]);

  return <div ref={editorRef} />;
};

export default SummernoteEditor;
