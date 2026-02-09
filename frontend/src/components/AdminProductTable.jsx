function AdminProductTable({ products }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <	th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Stock</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-4 py-2 border">{product.name}</td>
              <td className="px-4 py-2 border">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2 border">{product.stock}</td>
              <td className="px-4 py-2 border">{product.categoryId?.name || 'N/A'}</td>
              <td className="px-4 py-2 border">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductTable;