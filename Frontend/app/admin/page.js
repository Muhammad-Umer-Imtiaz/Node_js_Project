"use client";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [tools, setTools] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tools");
        const data = await response.json();

        setTools(data.tools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleStatusChange = async (toolId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tools/${toolId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTools((prevTools) =>
          prevTools.map((tool) =>
            tool._id === toolId ? { ...tool, status } : tool
          )
        );
        setSuccessMessage(`Tool ${status} successfully!`);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        console.log("Full response:", data);
      } else {
        console.error(
          "Failed to update status:",
          data?.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {successMessage && (
        <div
          className={`${
            successMessage.includes("accepted") ? "bg-green-500" : "bg-red-500"
          } text-white p-3 rounded-md text-center mb-4`}
        >
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : tools.length === 0 ? (
        <p className="text-center text-gray-600">No tools submitted yet.</p>
      ) : Array.isArray(tools) && tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(
            (tool) => (
              console.log("Rendering tool:", tool._id, tool.name),
              (
                <div
                  key={tool._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:5000${tool.image}`}
                    alt={tool.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
                  <p className="mb-4">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        tool.status === "accepted"
                          ? "text-green-500"
                          : tool.status === "rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {tool.status || "Pending"}
                    </span>
                  </p>
                  <div className="flex justify-between">
                    <button
                      className={` px-4 py-2 rounded-md transition font-semibold ${
                        tool.status === "accepted"
                          ? "bg-green-300 text-white cursor-not-allowed"
                          : tool.status === "pending"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        tool.status === "pending" &&
                        handleStatusChange(tool._id, "accepted")
                      }
                      disabled={tool.status !== "pending"}
                      title={
                        tool.status !== "pending"
                          ? `Already ${tool.status}`
                          : ""
                      }
                    >
                      {tool.status === "accepted" ? "Accepted" : "Accept"}
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md transition font-semibold ${
                        tool.status === "rejected"
                          ? "bg-red-300 text-white cursor-not-allowed"
                          : tool.status === "pending"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        tool.status === "pending" &&
                        handleStatusChange(tool._id, "rejected")
                      }
                      disabled={tool.status !== "pending"}
                      title={
                        tool.status !== "pending"
                          ? `Already ${tool.status}`
                          : ""
                      }
                    >
                      {tool.status === "rejected" ? "Rejected" : "Reject"}
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
