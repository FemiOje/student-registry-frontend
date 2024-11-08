interface TableRowProps {
    age: bigint;
    fname: bigint;
    id: bigint;
    is_active: boolean;
    lname: bigint;
    phone_number: bigint;
  }
  
  export default function TableRow({ age, fname, id, is_active, lname, phone_number }: TableRowProps) {
    return (
      <tr className="even:bg-gray-50">
        <td className="px-4 py-2 text-gray-700">{id.toString()}</td>
        <td className="px-4 py-2 text-gray-700">{fname.toString()}</td>
        <td className="px-4 py-2 text-gray-700">{lname.toString()}</td>
        <td className="px-4 py-2 text-gray-700">{age.toString()}</td>
        <td className="px-4 py-2 text-gray-700">{is_active ? "Active" : "Inactive"}</td>
        <td className="px-4 py-2 text-gray-700">{phone_number.toString()}</td>
        <td className="px-4 py-2 bg-gray-300 rounded">
          <button>Edit</button>
        </td>
        <td className="px-4 py-2 bg-red-300 rounded">
          <button>Delete</button>
        </td>
      </tr>
    );
  }
  