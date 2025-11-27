"use client";

import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import NewTemplateForm from "@/components/NewTemplateForm";
import BankStatementTemplatePage from "@/components/BankStatementTemplate";
import InvoiceTemplatePage from "@/components/InvoiceTemplate";

interface Template {
  _id?: string;
  name: string;
  category: string;
  htmlFile?: string;
  cssFile?: string;
}

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

  // Fetch Templates from API
  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTemplates(data.data);
      });
  }, []);

  // Save new template
  const handleSaveTemplate = (savedTemplate: any) => {
    setTemplates((prev) => [...prev, savedTemplate]);
    setShowForm(false);
  };

  // Add Template
  const handleAddTemplate = () => {
    setShowForm(true);
  };

  // Delete Template
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setTemplates(templates.filter((t) => t._id !== id));
    } else {
      alert("Failed to delete");
    }
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete?._id) {
      await handleDelete(templateToDelete._id);
      setTemplateToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setTemplateToDelete(null);
    setShowDeleteModal(false);
  };

  // Upload/Edit File
  const handleFileChange = (id: string, file: File, type: "htmlFile" | "cssFile") => {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileContent = reader.result as string;

      // update frontend state
      setTemplates(templates.map((t) => (t._id === id ? { ...t, [type]: fileContent } : t)));

      // update backend db
      await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: fileContent }),
      });
    };
    reader.readAsText(file);
  };

  //View Template — open same statement preview route
  const handleViewTemplate = async (template: Template) => {
    try {
      // Fetch latest generated statement for this template
      const res = await fetch(`/api/get_latest_statement?template=${encodeURIComponent(template.name)}`);
      const data = await res.json();

      if (data.statement) {
        const statementId = data.statement._id;
        const companyId = data.statement.companyId || "68dba9b14c2c1f496ada4c8f"; // fallback
        window.location.href = `/statement-preview/${statementId}?companyId=${companyId}&template=${encodeURIComponent(template.name)}`;
      } else {
        alert("No generated bank statement found for this template yet.");
      }
    } catch (err) {
      console.error("Error fetching statement:", err);
      alert("Error loading bank statement.");
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  return (
    <div className="p-6">
      {viewingTemplate ? (
        <div>
          <button
            onClick={() => setViewingTemplate(null)}
            className="mb-4 px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </button>

          {viewingTemplate.category === "Bank Statement" ? (
            <BankStatementTemplatePage
              templateName={viewingTemplate.name.toString()}
              selectedCompanyId={selectedCompanyId}
            />
          ) : viewingTemplate.category === "Invoice" ? (
            <InvoiceTemplatePage templateName={viewingTemplate.name.toString()} />
          ) : (
            <div className="p-4 bg-yellow-100 rounded">Unsupported Template Type</div>
          )}
        </div>
      ) : showForm ? (
        <NewTemplateForm onSave={handleSaveTemplate} onCancel={() => setShowForm(false)} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4">Templates</h2>
            <button
              onClick={handleAddTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add Template
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Template List */}
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div
                key={template._id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
              >
                <div>
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.category}</div>
                </div>

                <div className="flex gap-3 items-center">
                  {/* View Icon */}
                  <button
                    onClick={() => handleViewTemplate(template)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Eye className="h-5 w-5" />
                  </button>

                  {/*Edit Icon */}
                  <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                    <Edit className="h-5 w-5" />
                    <input
                      type="file"
                      accept=".html,.css"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        handleFileChange(template._id!, e.target.files[0], "htmlFile")
                      }
                    />
                  </label>

                  {/*Delete Icon */}
                  <button
                    onClick={() => {
                      setTemplateToDelete(template);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <p className="text-gray-500 text-sm">No templates found.</p>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Delete Template</h2>
            <p className="mb-6">
              Are you sure you want to delete <br />
              <span className="font-semibold">{templateToDelete?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg border bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
