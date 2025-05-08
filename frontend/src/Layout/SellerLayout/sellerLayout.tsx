import { useEffect, useState, useCallback } from "react";
import { GetUserById } from "../../services/https";
import { UsersInterface } from "../../interfaces/IUser";
import shoppo from "../../assets/shoppo-orange.png";
import promo from "../../assets/promo.jpg";

const SellerLayout = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [user, setUser] = useState<UsersInterface | null>(null);
  const userId = localStorage.getItem("id");

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setUser(null);
      return;
    }

    try {
      const response = await GetUserById(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showLogoutPopup && target && !target.closest(".user-menu")) {
        setShowLogoutPopup(false);
      }
    },
    [showLogoutPopup]
  );

  useEffect(() => {
    if (showLogoutPopup) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLogoutPopup, handleClickOutside]);

  return (
    <>
      <header className="bg-white text-black shadow-sm fixed w-full top-0 left-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <a
              href="/home"
              className="flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <img src={shoppo} alt="Shoppo Logo" className="h-8 md:h-10" />
            </a>
            <div className="flex items-center space-x-4">
              <span className="hidden md:block font-medium text-gray-800">
                {user?.UserName || "Guest"}
              </span>

              <div className="relative user-menu">
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 
                  transition-colors duration-200 focus:outline-none focus:ring-2 
                  focus:ring-gray-300"
                  onClick={() => setShowLogoutPopup((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={showLogoutPopup}
                  aria-label="User menu"
                >
                  <img
                    src={promo}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {showLogoutPopup && (
                  <div
                    className="absolute right-0 top-12 w-48 bg-white rounded-lg 
                    shadow-md border border-gray-200 z-10"
                    role="menu"
                  >
                    <button
                      className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 
                      flex items-center space-x-2 transition-colors"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className="mt-24"></div>
    </>
  );
};

export default SellerLayout;
