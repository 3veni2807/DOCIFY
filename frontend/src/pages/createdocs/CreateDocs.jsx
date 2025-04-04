import React, { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "react-quill/dist/quill.snow.css";
import "./CreateDocs.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
import { useNavigate, useParams } from "react-router-dom";

//Register Quill Table module
Quill.register({ "modules/better-table": QuillBetterTable }, true);

const CreateDocs = () => {
  const { docId } = useParams(); // Get document ID if editing an existing document
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch existing document if editing
  useEffect(() => {
    if (docId) {
      fetchDocument(docId);
    }
  }, [docId]);

  const fetchDocument = async (id) => {
    try {
      const response = await fetch(`https://docify-backend-i5o4.onrender.com/api/documents/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch document");

      const data = await response.json();
      setTitle(data.title);
      setContent(data.content); // Set the content for editing
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("Failed to load document.");
    }
  };

  // Save or Update a document in MongoDB
  const saveDocument = async () => {
    if (!title.trim()) {
      alert("Please enter a title for the document!");
      return;
    }

    if (!user || !user.id || !token) {
      alert("You must be logged in to save documents!");
      navigate("/login");
      return;
    }

    setLoading(true);
    const docData = { title, content, userId: user.id };

    try {
      let response;
      if (docId) {
        // Update existing document
        response = await fetch(`https://docify-backend-i5o4.onrender.com/api/documents/${docId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(docData),
        });
      } else {
        // Create new document
        response = await fetch("https://docify-backend-i5o4.onrender.com/api/documents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(docData),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save document!");
      }

      setLoading(false);
      navigate("/viewdocs"); // Navigate to ViewDocs page after saving
    } catch (error) {
      console.error("Error saving document:", error);
      alert(error.message); // Show the error message to the user
      setLoading(false);
    }
  };

  // Download the document as a PDF
  const downloadPDF = async () => {
    if (!quillRef.current) return;

    const editorElement = quillRef.current.getEditor().root;
    if (!editorElement) return;

    const canvas = await html2canvas(editorElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`${title || "document"}.pdf`);
  };

  return (
    <div className="editor-container">
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        theme="snow"
        modules={{
          toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            [{ script: "sub" }, { script: "super" }],
            ["link", "image", "video"],
            ["table"],
            ["clean"],
          ],
          
        }}
        formats={[
          "font", "size", "bold", "italic", "underline", "strike", "color", "align",
          "list", "blockquote", "code-block", "script", "link", "image", "video", "table",
        ]}
      />

      <div className="buttons-container">
        <button className="download-btn" onClick={downloadPDF}>
          Download as PDF
        </button>
        <button className="save-btn" onClick={saveDocument} disabled={loading}>
          {loading ? "Saving..." : docId ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default CreateDocs;