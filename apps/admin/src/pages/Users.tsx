import { useState } from 'react';
import { useUsers, useUpdateUserRole } from '../hooks/queries/useUsers';
import {
  PencilIcon,
  NoSymbolIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Users() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: users, isLoading, error } = useUsers();
  const updateRole = useUpdateUserRole();

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRole.mutate({ userId, role: newRole });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-error font-medium">
          Error loading users: {(error as Error).message || 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="support">Support</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-1">
                      <button className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-gray-100">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-gray-100">
                        {user.isActive ? (
                          <NoSymbolIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handleChangePage(null, page - 1)}
              disabled={page === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 0
                  ? 'text-gray-300 bg-gray-50'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(null, page + 1)}
              disabled={(page + 1) * rowsPerPage >= (users?.length || 0)}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                (page + 1) * rowsPerPage >= (users?.length || 0)
                  ? 'text-gray-300 bg-gray-50'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{page * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min((page + 1) * rowsPerPage, users?.length || 0)}
                </span>{' '}
                of <span className="font-medium">{users?.length || 0}</span>{' '}
                results
              </p>
            </div>
            <div>
              <div className="flex items-center">
                <select
                  className="mr-2 block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  {[5, 10, 25].map((option) => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </select>

                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      page === 0
                        ? 'text-gray-300'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {[
                    ...Array(
                      Math.ceil((users?.length || 0) / rowsPerPage),
                    ).keys(),
                  ]
                    .slice(0, 5)
                    .map((num) => (
                      <button
                        key={num}
                        onClick={() => handleChangePage(null, num)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          page === num
                            ? 'z-10 bg-primary text-white border-primary'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {num + 1}
                      </button>
                    ))}

                  <button
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={(page + 1) * rowsPerPage >= (users?.length || 0)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      (page + 1) * rowsPerPage >= (users?.length || 0)
                        ? 'text-gray-300'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
