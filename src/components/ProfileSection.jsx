import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

const ProfileSection = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content:
      "To work in an environment which encourages me to succeed and grow professionally where I can utilize my skills and knowledge appropriately.",
  });

  if (!editor) return null;

  return (
    <div>
     

      {/* Description Label */}
      <label className="text-sm text-gray-600 mb-1 block">Description</label>

      {/* Editor Area */}
      <div className="rounded border">
        <div className="p-3 min-h-[80px] outline-none focus:outline-none">
          <EditorContent editor={editor} className="outline-none focus:outline-none" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-t px-2 py-1 bg-white rounded-b">
          <div className="flex items-center gap-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">B</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">I</button>
            <button onClick={() => editor.chain().focus().toggleUnderline?.().run()} className="btn">U</button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">•</button>
            <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className="btn">⇤</button>
            <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className="btn">↔</button>
            <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className="btn">⇥</button>
          </div>

          <button className="bg-gray-100 text-sm px-3 py-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1">
            <span>✨</span> AI Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
