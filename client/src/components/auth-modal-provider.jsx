import React, { createContext, useContext, useState } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { X } from "lucide-react";

const AuthModalContext = createContext(undefined);

export function AuthModalProvider({ children }) {
  const [modalType, setModalType] = useState(null); // 'login' | 'register' | null

  const openLogin = () => setModalType("login");
  const openRegister = () => setModalType("register");
  const closeAll = () => setModalType(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAll();
    }
  };

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, closeAll, modalType }}>
      {children}
      {modalType && (
        <div 
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10 px-4 animate-fade-in"
        >
          <div className={`relative w-full transition-all duration-300 animate-auth-card-in ${
            modalType === "register" ? "max-w-[580px]" : "max-w-[460px]"
          }`}>
            {/* Close button on modal */}
            <button
              onClick={closeAll}
              className="absolute top-4 right-4 z-50 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {modalType === "login" ? (
              <LoginPage 
                isModal={true} 
                onClose={closeAll} 
                onSwitchToRegister={openRegister} 
              />
            ) : (
              <RegisterPage 
                isModal={true} 
                onClose={closeAll} 
                onSwitchToLogin={openLogin} 
              />
            )}
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
