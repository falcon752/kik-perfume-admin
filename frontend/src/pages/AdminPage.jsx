import { BarChart, PlusCircle, ShoppingBasket, FileText, List } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import CreateBlogForm from "../components/CreateBlogForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";
import BlogsList from "../components/BlogsList";

const saddleBrown = "#8B4513";
const saddleBrownHover = "#7A3E0F";
const greekVilla = "#F0EBE3";
const bgBlack = "#000000";
const bgTab = "#121212"
const textGray = "text-gray-300";
const bgGrayDark = "bg-gray-800";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "create-blogs", label: "Create Blog", icon: FileText },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "blogs", label: "Blogs", icon: List },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: bgTab }}
    >
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: greekVilla }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-200 hover:text-white"
                }`}
              style={{
                backgroundColor: activeTab === tab.id ? saddleBrown : "transparent",
                border: `1px solid ${saddleBrown}`,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id)
                  e.currentTarget.style.backgroundColor = saddleBrownHover;
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <tab.icon
                className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? "text-white" : "text-gray-200"
                }`}
              />
              {tab.label}
            </button>
          ))}
        </div>

        <div
        //   className={`${bgGrayDark} rounded-lg p-8 shadow-lg`}
        //   style={{ border: `1px solid ${saddleBrown}` }}
        >
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "create-blogs" && <CreateBlogForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "blogs" && <BlogsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
