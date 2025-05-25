import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package } from "lucide-react";

const saddleBrown = "#8B4513";
const saddleBrownLight = "#A45C24";
const greekVilla = "#F0EBE3";
const bgTab = "#121212";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        // Assuming API still sends these fields; ignore sales/revenue here
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
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          colorGradient={[saddleBrownLight, saddleBrown]}
        />
      </div>
      {/* Chart section removed */}
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, colorGradient }) => (
  <motion.div
    className="rounded-lg p-6 shadow-lg relative overflow-hidden"
    style={{
      background: `linear-gradient(135deg, ${colorGradient[0]}, ${colorGradient[1]})`,
      color: greekVilla,
      boxShadow: `0 0 15px ${saddleBrown}99`,
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-sm mb-1 font-semibold" style={{ color: greekVilla }}>
          {title}
        </p>
        <h3 className="text-3xl font-bold" style={{ color: greekVilla }}>
          {value}
        </h3>
      </div>
    </div>
    <div
      className="absolute inset-0 opacity-30"
      style={{ background: `linear-gradient(135deg, ${colorGradient[0]}, ${colorGradient[1]})` }}
    />
    <div
      className="absolute -bottom-4 -right-4 opacity-50"
      style={{ color: "#FFFFFF" }} // white color applied here
    >
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
