export default function TableRow() {
    return (
        <tr className="even:bg-gray-50">
            <td className="px-4 py-2 text-gray-700">Row 1, Cell 1</td>
            <td className="px-4 py-2 text-gray-700">Row 1, Cell 2</td>
            <td className="px-4 py-2 text-gray-700">Row 1, Cell 3</td>
            <td className="px-4 py-2 bg-gray-300 rounded">
                <button> Edit</button>
            </td>
            <td className="px-4 py-2 bg-red-300 rounded">
                <button> Delete</button>
            </td>
        </tr>
    )
}