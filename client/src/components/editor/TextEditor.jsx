import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDarkMode } from "../../context/DarkModeContext";
import { useState, useEffect, useCallback } from "react";
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
  FaFileUpload,
  FaTimes,
} from "react-icons/fa";
import { Button } from "../ui/Button";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import mammoth from "mammoth";
import { useDropzone } from "react-dropzone";
import { Document, Paragraph, TextRun, Packer } from "docx";


const TextEditor = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [savedContent, setSavedContent] = useState("");
  const [uploadError, setUploadError] = useState(null);

  // Initialize the TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
    ],
    content: localStorage.getItem("savedText") || "<p>Start writing here...</p>",
    onUpdate: ({ editor }) => {
      setSavedContent(editor.getHTML());
      localStorage.setItem("savedText", editor.getHTML());
    },
  });

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadError(null);
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileType = file.name.split(".").pop().toLowerCase();

    try {
       if (fileType === "docx") {
        const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
        editor.commands.setContent(result.value || "<p>(No content)</p>");
      }
    } catch (error) {
      console.error("File processing error:", error);
      setUploadError("Failed to process the file. Please try another.");
    }
  }, [editor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  // Download as DOCX
  const downloadWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: editor.getText(),
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.docx";
    link.click();
    URL.revokeObjectURL(url);
  };


  if (!editor) {
    return <div className="text-center">Loading editor...</div>;
  }

  return (
    <div className={`p-6 h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-500">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2">
          <FaArrowLeft className="text-lg" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">Write Your Story</h1>
        <div className="flex space-x-2">
          <Button onClick={downloadWord} variant="outline">
            <FaDownload /> DOCX
          </Button>
        </div>
      </div>

      {/* Visible Dropzone Area */}
      <div 
        {...getRootProps()} 
        className={`p-8 mb-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? 
            "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : 
            darkMode ? 
              "border-gray-600 hover:border-gray-500" : 
              "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <FaFileUpload className="mx-auto text-3xl mb-2" />
        <p className="font-medium">Drag & drop DOCX files here</p>
        <p className="text-sm opacity-70">or click to browse files</p>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className={`p-3 mb-4 rounded ${darkMode ? 'bg-red-900' : 'bg-red-100'} text-red-500`}>
          <div className="flex justify-between items-center">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError(null)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Toolbar Section */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-500">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 ${editor.isActive("bold") ? "text-blue-500" : ""}`}>
          <FaBold />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 ${editor.isActive("italic") ? "text-blue-500" : ""}`}>
          <FaItalic />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 ${editor.isActive("underline") ? "text-blue-500" : ""}`}>
          <FaUnderline />
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 ${editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""}`}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 ${editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""}`}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 ${editor.isActive("heading", { level: 3 }) ? "text-blue-500" : ""}`}>
          H3
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`p-2 ${editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""}`}>
          <FaAlignLeft />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`p-2 ${editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""}`}>
          <FaAlignCenter />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`p-2 ${editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""}`}>
          <FaAlignRight />
        </button>
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