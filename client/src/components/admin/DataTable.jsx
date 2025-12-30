import { FileX } from "lucide-react";

/**
 * @param {Array} columns - Array of objects: { header: "Name", accessor: "name", render: (row) => ... }
 * @param {Array} data - Array of data objects
 * @param {Function} onRowClick - Optional callback when a row is clicked
 */
const DataTable = ({ columns = [], data = [], onRowClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          
          {/* --- HEADER --- */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* --- BODY --- */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                      <FileX className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-colors duration-200 ${
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50/50"
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {/* Logic:
                         1. If 'render' function exists, use it (for buttons, images, badges).
                         2. Else, access data using the 'accessor' key.
                      */}
                      {col.render
                        ? col.render(row)
                        : row[col.accessor] || <span className="text-gray-400">-</span>}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;