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

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    phone_number: "",
    age: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStudentFormData({
      ...studentFormData,
      [name]: value,
    });

    switch (name) {
      case "fname":
        if (value.length > 31) {
          setErrors((prev) => ({
            ...prev,
            [name]: `${name} cannot exceed 31 characters.`,
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        break;

      case "lname":
        if (value.length > 31) {
          setErrors((prev) => ({
            ...prev,
            [name]: `${name} cannot exceed 31 characters.`,
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        break;

      case "age":
        if (!/^\d+$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            age: "Age must be a positive integer.",
          }));
        } else if (parseInt(value) <= 0) {
          setErrors((prev) => ({
            ...prev,
            age: "Age must be greater than 0.",
          }));
        }
        else if (BigInt(value) > BigInt("18446744073709551615")) {
          setErrors((prev) => ({
            ...prev,
            age: "Age cannot exceed the maximum value of u64.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, age: "" }));
        }
        break;

      case "phone_number":
        if (!/^\d{10}$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            phone_number: "Phone number must be exactly 10 digits.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, phone_number: "" }));
        }
        break;

      default:
        break;
    }
  };


  const { contract } = useContract({
    abi: student_contract_abi,
    address: import.meta.env.VITE_STUDENT_CONTRACT_ADDRESS,
  });

  const { address } = useAccount();
  const { send: sendDelete, status: deleteStatus, error: deleteError } = useSendTransaction({
    calls:
      contract && address && id
        ? [contract.populate("delete_student", [id])]
        : undefined,
  });

  const { send: sendEditStudent, status: editStatus, error: editError } = useSendTransaction({
    calls:
      contract && address && studentFormData
        ? [contract.populate("update_student", [
          studentFormData.id,
          studentFormData.fname && studentFormData.fname.length <= 31 ? studentFormData.fname : "null",
          studentFormData.lname && studentFormData.lname.length <= 31 ? studentFormData.lname : "null",
          studentFormData.phone_number ? studentFormData.phone_number : 1,
          studentFormData.age ? studentFormData.age : 1
        ])]
        : undefined,
  });
  const deleteErrorMessage = deleteError?.message?.toString() || "An unexpected error occurred";
  const editErrorMessage = editError?.message?.toString() || "An unexpected error occurred";

  let isValid = true;

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { fname: "", lname: "", phone_number: "", age: "" };

    if (studentFormData.fname.length > 31) {
      isValid = false;
      newErrors.fname = "First name cannot exceed 31 characters.";
    }

    if (studentFormData.lname.length > 31) {
      isValid = false;
      newErrors.lname = "Last name cannot exceed 31 characters.";
    }

    if (!/^\d+$/.test(studentFormData.age)) {
      isValid = false;
      newErrors.age = "Age must be a positive integer.";
    } else if (BigInt(studentFormData.age) > BigInt("18446744073709551615")) {
      isValid = false;
      newErrors.age = "Age cannot exceed the maximum value of u64.";
    }

    if (!/^\d{10}$/.test(studentFormData.phone_number)) {
      isValid = false;
      newErrors.phone_number = "Phone number must be exactly 10 digits.";
    }

    setErrors(newErrors);

    if (!isValid) return;

    sendEditStudent();
    setIsEditModalOpen(false);
  };



  useEffect(() => {
    switch (deleteStatus) {
      case "success":
        toast.success("Deleted successfully.");
        break;

      case "error":
        toast.error(deleteErrorMessage);
        break;

      case "pending":
        toast.loading("Deleting entry...");
        break;

      default:
        break;
    }
  }, [deleteStatus, deleteErrorMessage])

  useEffect(() => {
    switch (editStatus) {
      case "success":
        toast.success("Edited successfully.");
        break;

      case "error":
        toast.error(editErrorMessage);
        break;

      case "pending":
        toast.loading("Editing entry...");
        break;

      default:
        break;
    }
  }, [editStatus, editErrorMessage])


  const handleDelete = () => {
    sendDelete();
    setIsDeleteModalOpen(false);
  };

  const isFormValid =
    studentFormData.fname.length <= 31 &&
    studentFormData.lname.length <= 31 &&
    /^\d+$/.test(studentFormData.age) && 
    parseInt(studentFormData.age) > 0 &&
    BigInt(studentFormData.age) <= BigInt("18446744073709551615") &&
    /^\d{10}$/.test(studentFormData.phone_number) &&
    Object.values(errors).every((error) => error === "");

  return (
    <>
      <tr className="even:bg-gray-50">
        <td className="px-4 py-2 text-gray-700">{id.toString()}</td>
        <td className="px-4 py-2 text-gray-700">{bigIntToString(fname)}</td>
        <td className="px-4 py-2 text-gray-700">{bigIntToString(lname)}</td>
        <td className="px-4 py-2 text-gray-700">{age.toString()}</td>
        <td className={`px-4 py-2 ${is_active ? "text-green-700" : "text-red-700"}`}>
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
            <p className="mb-6">Do you really want to deactivate this student?</p>
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

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={studentFormData.fname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none ${errors.fname ? "border-red-500" : ""
                    }`}
                />
                {errors.fname && (
                  <p className="text-red-500 text-sm">{errors.fname}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={studentFormData.lname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none ${errors.lname ? "border-red-500" : ""
                    }`}
                />
                {errors.lname && (
                  <p className="text-red-500 text-sm">{errors.lname}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Age</label>
                <input
                  type="text"
                  name="age"
                  value={studentFormData.age}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none ${errors.age ? "border-red-500" : ""
                    }`}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={studentFormData.phone_number}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none ${errors.phone_number ? "border-red-500" : ""
                    }`}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{errors.phone_number}</p>
                )}
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
                  className={`px-4 py-2 rounded text-white ${isFormValid
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-300 cursor-not-allowed"
                    }`}
                  disabled={!isFormValid}
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
