import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { bigIntToString } from "../helpers/converters";
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core";
import { student_contract_abi } from "../abis/student_contract_abi";
import toast from "react-hot-toast";

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

  // formatted data for display in form
  const [studentFormData, setStudentFormData] = useState({
    id,
    fname: bigIntToString(fname),
    lname: bigIntToString(lname),
    phone_number: phone_number.toString(),
    age: age.toString(),
    is_active
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({
      ...studentFormData,
      [name]: value,
    });
  };

  const { contract } = useContract({
    abi: student_contract_abi,
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
  });

  const { address } = useAccount();
  const { send: sendDelete, status: deleteStatus, error: deleteError, data: deleteData } = useSendTransaction({
    calls:
      contract && address && id
        ? [contract.populate("delete_student", [id])]
        : undefined,
  });
  const errorMessage = deleteError?.message?.toString() || "An unexpected error occurred";

  const { send: sendEditStudent, status: editStatus, error: editError, data: editData } = useSendTransaction({
    calls:
      contract && address && studentFormData
        ? [contract.populate("update_student", [studentFormData.id, studentFormData.fname, studentFormData.lname, studentFormData.phone_number, studentFormData.age])]
        : undefined,
  });



  useEffect(() => {
    switch (deleteStatus) {
      case "success":
        toast.success("Deleted successfully.");
        break;

      case "error":
        toast.error(errorMessage);
        break;

      case "pending":
        toast.loading("Deleting entry...");
        break;

      default:
        break;
    }
  }, [deleteStatus, errorMessage])


  const handleDelete = () => {
    sendDelete();
    setIsDeleteModalOpen(false);
    console.log("Resolved data: ", deleteData);
  };


  const handleEdit = () => {
    sendEditStudent();
    setIsEditModalOpen(false);
    console.log("Updated student data: ", editData);
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
                onClick={() => handleDelete()}
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
                  value={studentFormData.id.toString()}
                  readOnly
                  disabled
                  className="w-full text-gray-400 px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={studentFormData.fname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={studentFormData.lname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Age</label>
                <input
                  type="text"
                  name="age"
                  value={studentFormData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={studentFormData.phone_number}
                  onChange={handleInputChange}
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
