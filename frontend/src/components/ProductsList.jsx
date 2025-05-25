import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const saddleBrown = "#8B4513";
const saddleBrownHover = "#7A3E0F";
const greekVilla = "#F0EBE3";
const bgTab = "#121212";

const ProductsList = () => {
  const { deleteProduct, products } = useProductStore();

  return (
    <motion.div
      className="rounded-lg overflow-hidden max-w-4xl mx-auto"
      style={{ backgroundColor: bgTab, boxShadow: `0 0 15px ${saddleBrown}55` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${saddleBrown}` }}>
            {["Product", "Category", "Link", "Actions"].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: greekVilla }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr
              key={product._id}
              className="hover:cursor-pointer"
              style={{
                backgroundColor: bgTab,
                borderBottom: `1px solid ${saddleBrown}`,
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saddleBrownHover + "33")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgTab)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                      style={{ border: `1px solid ${saddleBrown}` }}
                    />
                  </div>
                  <div className="ml-4">
                    <div style={{ color: greekVilla, fontWeight: "600" }}>
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap" style={{ color: greekVilla }}>
                {product.category}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {product.productLink ? (
                  <a
                    href={product.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#50FA7B", // bright green
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#38D14C")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#50FA7B")}
                  >
                    View Product
                  </a>
                ) : (
                  <span style={{ color: "#7D7D7D", fontStyle: "italic" }}>No link</span>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteProduct(product._id)}
                  style={{
                    color: "#FF5555",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3333")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#FF5555")}
                  aria-label={`Delete product ${product.name}`}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
