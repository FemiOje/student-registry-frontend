import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { bigIntToString } from "../helpers/converters";

interface TableRowProps {
  age: bigint;
  fname: bigint;
  id: bigint;
  is_active: boolean;
  lname: bigint;
  phone_number: bigint;
}

export default function TableRow({
  age,
  fname,
  id,
  is_active,
  lname,
  phone_number,
}: TableRowProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ editData, setEditData ] = useState();

  const handleDelete = () => {
    // Add the actual delete logic here
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    // Add the actual edit logic here
    setIsEditModalOpen(false);
  };

  return (
    <>
      <tr className="even:bg-gray-50">
        <td className="px-4 py-2 text-gray-700">{id.toString()}</td>
        <td className="px-4 py-2 text-gray-700">{bigIntToString(fname)}</td>
        <td className="px-4 py-2 text-gray-700">{bigIntToString(lname)}</td>
        <td className="px-4 py-2 text-gray-700">{age.toString()}</td>
        <td className="px-4 py-2 text-gray-700">
          {is_active ? "Active" : "Inactive"}
        </td>
        <td className="px-4 py-2 text-gray-700">{phone_number.toString()}</td>
        <td className="px-4 py-2">
          <button
            className="flex items-center justify-center bg-blue-500 text-white rounded-full p-2 mr-2 hover:bg-blue-600"
            aria-label="Edit"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FaEdit />
          </button>
        </td>
        <td className="px-4 py-2">
          <button
            className="flex items-center justify-center bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            aria-label="Delete"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <FaTrash />
          </button>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">Do you really want to delete this entry?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label className="block text-gray-700">ID</label>
                <input
                  type="text"
                  value={id.toString()}
                  readOnly
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={fname.toString()}
                  onChange={(e) => {
                    e.preventDefault();
                    // setEditData(fname: e, ...editData);
                  } /* Add logic to handle change */}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lname.toString()}
                  onChange={(e) => {} /* Add logic to handle change */}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Age</label>
                <input
                  type="text"
                  value={age.toString()}
                  onChange={(e) => {} /* Add logic to handle change */}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={phone_number.toString()}
                  onChange={(e) => {} /* Add logic to handle change */}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
