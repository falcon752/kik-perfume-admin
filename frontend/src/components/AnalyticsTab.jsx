import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Users, Package } from "lucide-react";
import { useUserStore } from "../stores/useUserStore"; // adjust path as needed
import ProductsList from "./ProductsList"; // import ProductsList component

const MySwal = withReactContent(Swal);

const saddleBrown = "#8B4513";
const saddleBrownLight = "#A45C24";
const greekVilla = "#F0EBE3";
const dark = "#121212";

const AnalyticsTab = () => {
  const user = useUserStore((state) => state.user); // access logged-in user if needed
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showProductsList, setShowProductsList] = useState(false); // state to toggle products list modal

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData({
          users: response.data.analyticsData.users,
          products: response.data.analyticsData.products,
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleUserClick = async () => {
    try {
      const res = await axios.get("/users");
      let users = res.data; // use let to allow reassignment

      const userListHtml = users
        .map(
          (user) => `
          <div style="margin-bottom: 1rem;">
            <div style="font-weight: bold;">${user.name} (${user.email})</div>
            <select 
              id="role-${user._id}" 
              style="padding: 6px; background: #1a1a1a; color: #fff; border-radius: 5px; border: 1px solid #444;">
              <option value="visitor" ${user.role === "visitor" ? "selected" : ""}>Visitor</option>
              <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
            </select>
          </div>
        `
        )
        .join("");

      const { isConfirmed } = await MySwal.fire({
        title: "Manage User Roles",
        html: `<div style="text-align: left; max-height: 300px; overflow-y: auto;">${userListHtml}</div>`,
        background: "#1a1a1a",
        color: "#fff",
        icon: "info",
        iconColor: saddleBrown,
        confirmButtonColor: saddleBrown,
        showCancelButton: true,
        confirmButtonText: "Update Roles",
      });

      if (isConfirmed) {
        for (let user of users) {
          const select = document.getElementById(`role-${user._id}`);
          const newRole = select?.value;

          if (newRole && newRole !== user.role) {
            try {
              await axios.put(`/users/${user._id}/role`, { role: newRole });
            } catch (err) {
              console.error(`Failed to update role for ${user.email}:`, err);
              // Optional: show partial error notification here without breaking loop
            }
          }
        }

        // refetch updated users after updates
        const resUpdated = await axios.get("/users");
        users = resUpdated.data;

        MySwal.fire({
          icon: "success",
          title: "Roles updated!",
          background: "#1a1a1a",
          color: "#fff",
          confirmButtonColor: saddleBrown,
        });
      }
    } catch (err) {
      console.error("Error fetching/updating users", err);
      MySwal.fire({
        icon: "error",
        title: "Failed to fetch or update users",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: saddleBrown,
      });
    }
  };

  const handleProductsClick = () => setShowProductsList(true);
  const handleCloseProductsList = () => setShowProductsList(false);

  if (isLoading) {
    return (
      <div style={{ color: greekVilla, textAlign: "center", marginTop: 50 }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ color: greekVilla }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          colorGradient={[saddleBrownLight, saddleBrown]}
          onClick={handleUserClick}
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          colorGradient={[saddleBrownLight, saddleBrown]}
          onClick={handleProductsClick}
        />
      </div>

      {showProductsList && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseProductsList}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: dark,
              padding: 20,
              borderRadius: 8,
              maxHeight: "90vh",
              overflowY: "auto",
              minWidth: 600,
            }}
          >
            <button
              onClick={handleCloseProductsList}
              style={{ marginBottom: 10, cursor: "pointer" }}
            >
              Close
            </button>
            <ProductsList />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, colorGradient, onClick }) => (
  <motion.div
    className="rounded-lg p-6 shadow-lg relative overflow-hidden cursor-pointer"
    style={{
      background: `linear-gradient(135deg, ${colorGradient[0]}, ${colorGradient[1]})`,
      color: greekVilla,
      boxShadow: `0 0 15px ${saddleBrown}99`,
    }}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 opacity-30" />
    <div className="absolute -bottom-4 -right-4 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
