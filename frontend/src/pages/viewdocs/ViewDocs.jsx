import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewDocs.css";

const ViewDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [showDocNameBox, setShowDocNameBox] = useState(false);
  const [docName, setDocName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null); // Store the document to delete
  const navigate = useNavigate();

  const tokenRef = useRef(localStorage.getItem("token"));

  // ✅ Fetch documents for the logged-in user
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("https://docify-backend-i5o4.onrender.com/api/documents", {
          headers: {
            "Authorization": `Bearer ${tokenRef.current}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            alert("Unauthorized! Please log in again.");
            navigate("/login");
          } else {
            alert(errorData.message || "Error fetching documents.");
          }
          return;
        }

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
        alert("Error fetching documents. Please try again later.");
      }
    };

    fetchDocuments();
  }, [navigate]);

  // ✅ Handle Edit
  const handleEdit = (docId) => {
    navigate(`/createdocs/${docId}`);
  };

  // ✅ Handle Delete
  const handleDelete = async () => {
    if (!docToDelete) return; // If no document to delete, return

    try {
      const response = await fetch(`https://docify-backend-i5o4.onrender.com/api/documents/${docToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${tokenRef.current}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete document: ${errorData.message}`);
        return;
      }

      // Remove document from the state after deletion
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docToDelete._id));
      setShowDeleteModal(false); // Close the modal after deletion
      setDocToDelete(null); // Clear the docToDelete state
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Error deleting document. Please try again later.");
    }
  };

  // ✅ Show Document Name Input
  const handleCreateNewDoc = () => {
    setShowDocNameBox(true);
  };

  // ✅ Handle Document Creation (POST request)
  const handleDocNameSubmit = async () => {
    if (!docName.trim()) {
      alert("Please enter a document name.");
      return;
    }

    try {
      const response = await fetch("https://docify-backend-i5o4.onrender.com/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: docName,
          content: "<p>New document content...</p>", // ✅ Default content added
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to create document: ${errorData.message}`);
        return;
      }

      const newDoc = await response.json();
      setDocuments((prevDocs) => [...prevDocs, newDoc]);
      setShowDocNameBox(false);
      setDocName("");

      // ✅ Navigate to createdocs page
      navigate(`/createdocs/${newDoc._id}`);
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Error creating document. Please try again later.");
    }
  };

  // Open the delete confirmation modal
  const openDeleteModal = (doc) => {
    setDocToDelete(doc);
    setShowDeleteModal(true);
  };

  // Close the delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDocToDelete(null);
  };

  return (
    <div className="view-docs-container">
      <div className="top-section">
        <h2 className="docs-heading">Your Documents</h2>
        <button className="create-doc-btn" onClick={handleCreateNewDoc}>
          + Create New Document
        </button>
      </div>

      {showDocNameBox && (
        <div className="doc-name-popup">
          <div className="popup-content">
            <h3>Enter Document Name</h3>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Document Name"
            />
            <div className="popup-buttons">
              <button onClick={handleDocNameSubmit}>Create</button>
              <button onClick={() => setShowDocNameBox(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="no-docs-message">No documents found, Every great idea begins with a single document. Start writing yours today!</p>
      ) : (
        <table className="docs-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(doc._id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => openDeleteModal(doc)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this document?</p>
            <div className="modal-buttons">
              <button onClick={handleDelete}>Yes, Delete</button>
              <button onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDocs;