import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDarkMode } from "../../context/DarkModeContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBold,
  FaItalic,
  FaUnderline,
  FaRedo,
  FaUndo,
  FaHeading,
  FaDownload,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";
import { Button } from "../ui/Button";
import jsPDF from "jspdf";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";

// Function to extract clean text (removes HTML)
const getCleanText = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Removes all HTML tags
};

const TextEditor = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [savedContent, setSavedContent] = useState("");

  // Initialize the TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["paragraph", "heading"] }), // Enable text alignment
    ],
    content: localStorage.getItem("savedText") || "<p>Start writing here...</p>", // Load saved content
    onUpdate: ({ editor }) => {
      setSavedContent(editor.getHTML());
      localStorage.setItem("savedText", editor.getHTML()); // Auto-save
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(localStorage.getItem("savedText") || "<p>Start writing here...</p>");
    }
  }, [editor]);

  if (!editor) {
    return <p className="text-center">Loading editor...</p>;
  }

  // Download as PDF
  const downloadPDF = () => {
    const pdf = new jsPDF();
    const textContent = getCleanText(editor.getHTML()); // Get clean text

    pdf.setFont("helvetica");
    pdf.text(textContent, 10, 10, { maxWidth: 180 }); // Ensure text wraps correctly
    pdf.save("document.pdf");
  };

  // Download as Word Document
  const downloadWord = () => {
    const textContent = getCleanText(editor.getHTML()); // Get clean text

    const blob = new Blob([textContent], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.doc";
    link.click();
  };

  return (
    <div className={`p-6 h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-500">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2">
          <FaArrowLeft className="text-lg" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">✍️ Write Your Story</h1>
        <div className="flex space-x-2">
          <Button onClick={downloadPDF} variant="outline">
            <FaDownload /> PDF
          </Button>
          <Button onClick={downloadWord} variant="outline">
            <FaDownload /> Word
          </Button>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex space-x-4 p-3 border-b border-gray-500">
        {/* Formatting Buttons */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 ${editor.isActive("bold") ? "text-blue-500" : ""}`}>
          <FaBold />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 ${editor.isActive("italic") ? "text-blue-500" : ""}`}>
          <FaItalic />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 ${editor.isActive("underline") ? "text-blue-500" : ""}`}>
          <FaUnderline />
        </button>
        
        {/* Heading Selection */}
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 ${editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""}`}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 ${editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""}`}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 ${editor.isActive("heading", { level: 3 }) ? "text-blue-500" : ""}`}>
          H3
        </button>

        {/* Alignment Buttons */}
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`p-2 ${editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""}`}>
          <FaAlignLeft />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`p-2 ${editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""}`}>
          <FaAlignCenter />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`p-2 ${editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""}`}>
          <FaAlignRight />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={`p-2 ${editor.isActive({ textAlign: "justify" }) ? "text-blue-500" : ""}`}>
          <FaAlignJustify />
        </button>

        {/* Undo & Redo */}
        <button onClick={() => editor.chain().focus().undo().run()} className="p-2">
          <FaUndo />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} className="p-2">
          <FaRedo />
        </button>
      </div>

      {/* Editor Container */}
      <div className={`border p-4 rounded-lg flex-grow ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <EditorContent editor={editor} className="p-2 min-h-[300px]" />
      </div>
    </div>
  );
};

export default TextEditor;
