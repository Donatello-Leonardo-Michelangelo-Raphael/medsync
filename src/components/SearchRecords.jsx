import React, { useState } from 'react';
import { Search, X, Loader2, Calendar, User, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchRecords({ onClose }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setSearching(true);
    setSearched(true);
    
    try {
      // Get all records
      const allRecords = await base44.entities.MedicalRecord.list('-created_date');
      
      // Use AI to match query with records
      const matchedRecords = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a medical records search assistant. The user is searching for: "${query}"

Here are all available medical records:
${allRecords.map((r, i) => `
Record ${i + 1}:
- ID: ${r.id}
- Title: ${r.title}
- Type: ${r.document_type}
- Doctor: ${r.doctor_name || 'N/A'}
- Date: ${r.record_date || r.created_date}
- Notes: ${r.notes || 'No notes'}
`).join('\n')}

Based on the user's search query, return the IDs of ALL records that match. Consider:
- Document type (prescription, lab_report, imaging, etc.)
- Date ranges (last month, last week, this year, etc.)
- Doctor names
- Any keywords in title or notes
- Medical conditions or terms mentioned

Return the matching record IDs in order of relevance.`,
        response_json_schema: {
          type: "object",
          properties: {
            matched_record_ids: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      const matchedIds = matchedRecords.matched_record_ids || [];
      const filteredResults = allRecords.filter(r => matchedIds.includes(r.id));
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    }
    
    setSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <button onClick={onClose} className="text-black p-2">
          <X className="w-6 h-6" />
        </button>
        <Input
          placeholder="e.g., imaging records from last month"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          className="flex-1 h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]"
        />
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || searching}
          className="bg-[#5B9BD5] hover:bg-[#4A8AC4] h-12 px-6"
        >
          {searching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {searching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Loader2 className="w-8 h-8 text-[#5B9BD5] animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Searching records...</p>
            </motion.div>
          )}

          {!searching && searched && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No matching records found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search</p>
            </motion.div>
          )}

          {!searching && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <p className="text-sm text-gray-600 mb-4">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <img
                      src={record.document_url}
                      alt={record.title}
                      className="w-16 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black mb-1">{record.title}</h3>
                      <div className="space-y-1">
                        {record.doctor_name && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{record.doctor_name}</span>
                          </div>
                        )}
                        {record.record_date && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{new Date(record.record_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="inline-block px-2 py-0.5 bg-[#5B9BD5]/10 text-[#5B9BD5] text-xs rounded-md">
                          {record.document_type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{record.notes}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {!searching && !searched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Search your medical records</p>
              <p className="text-sm text-gray-400">Try: "imaging from last month" or "prescriptions from Dr. Smith"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}