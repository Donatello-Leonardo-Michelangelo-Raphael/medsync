import React, { useState } from 'react';
import { ArrowLeft, Folder, FileText, Calendar, User, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';

export default function Records() {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['medical-records'],
    queryFn: () => base44.entities.MedicalRecord.list('-created_date')
  });

  // Group records by document type
  const folderData = {
    prescription: { label: 'Prescriptions', color: 'bg-blue-50 border-blue-200', icon: 'text-blue-600' },
    lab_report: { label: 'Lab Reports', color: 'bg-green-50 border-green-200', icon: 'text-green-600' },
    imaging: { label: 'Imaging', color: 'bg-purple-50 border-purple-200', icon: 'text-purple-600' },
    discharge_summary: { label: 'Discharge Summaries', color: 'bg-orange-50 border-orange-200', icon: 'text-orange-600' },
    insurance: { label: 'Insurance', color: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-600' },
    other: { label: 'Other Documents', color: 'bg-gray-50 border-gray-200', icon: 'text-gray-600' }
  };

  const groupedRecords = records.reduce((acc, record) => {
    const type = record.document_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(record);
    return acc;
  }, {});

  // Sort records within each folder by date (descending)
  Object.keys(groupedRecords).forEach(key => {
    groupedRecords[key].sort((a, b) => 
      new Date(b.record_date || b.created_date) - new Date(a.record_date || a.created_date)
    );
  });

  if (selectedFolder) {
    const folderRecords = groupedRecords[selectedFolder] || [];
    const folderInfo = folderData[selectedFolder];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <button onClick={() => setSelectedFolder(null)} className="text-black p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-black">{folderInfo.label}</h1>
        </header>

        {/* Documents List */}
        <div className="p-6 space-y-3">
          {folderRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents in this folder</p>
            </div>
          ) : (
            folderRecords.map(record => (
              <div
                key={record.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3">
                  <img
                    src={record.document_url}
                    alt={record.title}
                    className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-black mb-1 truncate">{record.title}</h3>
                    {record.doctor_name && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">{record.doctor_name}</span>
                      </div>
                    )}
                    {record.record_date && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(record.record_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <Link to={createPageUrl('Home')} className="text-black p-2">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-black">All Records</h1>
      </header>

      {/* Folders Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(folderData).map(([type, info]) => {
              const count = groupedRecords[type]?.length || 0;
              return (
                <button
                  key={type}
                  onClick={() => count > 0 && setSelectedFolder(type)}
                  className={`${info.color} border-2 rounded-2xl p-5 text-left transition-all ${
                    count > 0 ? 'hover:shadow-lg active:scale-95' : 'opacity-50'
                  }`}
                  disabled={count === 0}
                >
                  <Folder className={`w-10 h-10 mb-3 ${info.icon}`} />
                  <h3 className="font-medium text-black text-sm mb-1">{info.label}</h3>
                  <p className="text-xs text-gray-600">{count} document{count !== 1 ? 's' : ''}</p>
                </button>
              );
            })}
          </div>
        )}

        {records.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No records yet</p>
            <p className="text-sm text-gray-400">Scan your first document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}