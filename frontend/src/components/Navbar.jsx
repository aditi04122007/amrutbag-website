import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  Search as SearchIcon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut
} from "./Icons";

export default function Navbar() {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Amrut<span className="text-indigo-600"> Bag</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags, backpacks, duffels..."
                className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
              <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                <SearchIcon className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-600">
            <Link to="/" className={`transition-colors hover:text-indigo-600 ${location.pathname === "/" ? "text-indigo-600 font-semibold" : ""}`}>
              Home
            </Link>
            <Link to="/products" className={`transition-colors hover:text-indigo-600 ${location.pathname === "/products" ? "text-indigo-600 font-semibold" : ""}`}>
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200 hover:bg-purple-100 transition">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[11px] min-w-5 h-5 rounded-full flex items-center justify-center px-1 shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown or Auth Buttons */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition border border-gray-200 text-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium pr-1 text-gray-800 max-w-[120px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase">
                        {user.role || "Customer"}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        My Orders
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="my-1 border-t border-gray-100"></div>
                          <div className="px-4 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Admin Area
                          </div>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-500" />
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/products"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition"
                          >
                            <Package className="w-4 h-4 text-purple-500" />
                            Manage Products
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition"
                          >
                            <ShoppingCart className="w-4 h-4 text-purple-500" />
                            Manage Orders
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs shadow-indigo-200 transition hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-hidden focus:border-indigo-600 text-sm"
              />
              <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Products
          </Link>
          {user && (
            <>
              <Link
                to="/orders"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Profile
              </Link>
            </>
          )}

          {isAdmin && (
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase">Admin Portal</div>
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 hover:bg-purple-50"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 hover:bg-purple-50"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 hover:bg-purple-50"
              >
                Manage Orders
              </Link>
            </div>
          )}

          {user && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}