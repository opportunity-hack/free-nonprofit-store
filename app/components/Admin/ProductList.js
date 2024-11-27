export default function ProductList({ products, onEdit, onDelete }) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              // Ensure key is derived from `id`, or fallback to a unique value
              const key = product.id || `temp-key-${Math.random()}`;
              return (
                <tr key={key}>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </td>

                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="mr-2 text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  