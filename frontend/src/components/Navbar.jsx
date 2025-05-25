import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

import kikLogo from '../images/kik-logo.png'; // adjust path based on file location

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header
			className="fixed top-0 left-0 w-full bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b"
			style={{ backgroundColor: "#121212", borderColor: "rgba(139,69,19,0.8)" }}
		>
			<div className="container mx-auto px-4 py-3">
				<div className="flex flex-wrap justify-between items-center">
					<Link
						to="/"
						className="text-2xl font-bold items-center space-x-2 flex"
						style={{ color: "#8B4513" }}
					>
						<img src={kikLogo} alt="KIK Logo" className="h-10 w-auto" />
					</Link>

					<nav className="flex flex-wrap items-center gap-4">
						<a
							href="https://kikperfume.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-300 hover:text-[#8B4513] transition duration-300 ease-in-out"
						>
							Home
						</a>

						{/* {user && (
              <Link
                to={"/cart"}
                className="relative group text-gray-300 hover:text-[#8B4513] transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1"
                  size={20}
                  style={{ color: "inherit" }}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-opacity-90 transition duration-300 ease-in-out"
                    style={{ backgroundColor: "#8B4513" }}
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )} */}
						{isAdmin && (
							<Link
								className="text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
								to={"/dashboard"}
								style={{ backgroundColor: "#8B4513" }}
								onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7A3E0F")}
								onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8B4513")}
							>
								<Lock className="inline-block mr-1" size={18} />
								<span className="hidden sm:inline">Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
								onClick={logout}
							>
								<LogOut size={18} />
								<span className="hidden sm:inline ml-2">Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className="text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
									style={{ backgroundColor: "#8B4513" }}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7A3E0F")}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8B4513")}
								>
									<UserPlus className="mr-2" size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
								>
									<LogIn className="mr-2" size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};
export default Navbar;
