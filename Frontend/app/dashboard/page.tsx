
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

// Types based on API response
type Tool = {
  _id: string;
  name: string;
  link: string;
  image_url: string;
  thumbnail_url: string;
  is_approved: boolean;
  click_count: number;
  views: number;
  submitted_by: string;
  overview: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  tool: Tool[];
  stats: {
    total_tools: number;
    approved_tools: number;
    pending_tools: number;
  };
};

const Dashboard = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Tool>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total_tools: 0,
    approved_tools: 0,
    pending_tools: 0
  });
  const [error, setError] = useState<string>('');

  // Status configuration
  const statusConfig = {
    Approved: {
      label: 'Approved',
      color: 'text-green-700 bg-green-100',
      icon: CheckCircle
    },
    Pending: {
      label: 'Pending',
      color: 'text-yellow-700 bg-yellow-100',
      icon: Clock
    },
    Rejected: {
      label: 'Rejected',
      color: 'text-red-700 bg-red-100',
      icon: XCircle
    }
  };

  // Fetch tools from API
  const fetchTools = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/tool-by-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log(data.tool);
      if (data.success) {
        setTools(data.tool);
        setStats({
          total_tools: data.tool.length,
          approved_tools: data.tool.filter((tool) => tool.is_approved).length,
          pending_tools: data.tool.filter((tool) => !tool.is_approved).length,
        });
      } else {
        setError(data.message || "Failed to fetch tools");
      }
    } catch (err) {
      console.error("Error fetching tools:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tools");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTools();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = tools;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((tool) => {
        if (statusFilter === 'Approved') return tool.is_approved === true;
        if (statusFilter === 'Pending') return tool.is_approved === false;
        if (statusFilter === 'Rejected') return false; // Adjust based on actual Rejected logic
        return true;
      });
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'createdAt') {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      if (sortField === 'is_approved') { // Handle boolean sorting
        aValue = a.is_approved ? 1 : 0;
        bValue = b.is_approved ? 1 : 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      return 0;
    });

    setFilteredTools(filtered);
  }, [tools, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Tool) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (_id: string) => { // Fixed: Changed _id type to string
    if (window.confirm('Are you sure you want to delete this tool submission?')) {
      // TODO: Implement delete API call
      console.log('Delete tool with id:', _id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (isApproved: boolean) => { // Fixed: Changed parameter to boolean
    const status = isApproved ? 'Approved' : 'Pending';
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#7d42fb]" />
          <span className="text-gray-600">Loading your tools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tools</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTools}
            className="px-4 py-2 bg-[#7d42fb] text-white rounded-lg hover:bg-[#6b35d1] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your submitted AI tools</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchTools}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_tools}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved_tools}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending_tools}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tools by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-gray-600 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7d42fb40] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Tool Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Date Submitted
                      {sortField === 'createdAt' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('is_approved')} // Fixed: Changed 'status' to 'is_approved'
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'is_approved' && ( // Fixed: Changed 'status' to 'is_approved'
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-gray-300" />
                        <p>{tools.length === 0 ? "No tools submitted yet" : "No tools found matching your criteria"}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTools.map((tool) => (
                    <tr key={tool._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(tool.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[
                              tool.is_approved ? "Approved" : "Pending"
                            ].color
                          }`}
                        >
                          {getStatusIcon(tool.is_approved)} {/* Fixed: Pass boolean */}
                          {tool.is_approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-[#7d42fb] hover:text-[#6b35d1] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tool._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        {filteredTools.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredTools.length} of {tools.length} tools
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
