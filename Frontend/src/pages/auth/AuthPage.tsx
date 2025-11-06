import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "./LoginPage";
import Register from "./Register";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Determine flex direction based on isLogin
    const flexDirection = isLogin ? "md:flex-row" : "md:flex-row-reverse";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f3ef] px-4">
            <div
                className={`w-full max-w-4xl h-[90vh] flex ${flexDirection} rounded-2xl shadow-2xl border border-white/40 bg-white/60 backdrop-blur-lg overflow-hidden relative`}
            >
                {/* Animated Illustration */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? "login-ill" : "register-ill"}
                        initial={{ x: isLogin ? 100 : -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isLogin ? -100 : 100, opacity: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="hidden md:flex flex-1 items-center justify-center bg-[#f5f3ef] px-10 absolute inset-0 md:static z-10"
                        style={{
                            left: isLogin ? "auto" : 0,
                            right: isLogin ? 0 : "auto",
                        }}
                    >
                        <img
                            src="/assets/campus-ref.svg"
                            alt="Campus students illustration"
                            className="w-72 md:w-80 h-auto"
                            draggable={false}
                        />
                    </motion.div>
                </AnimatePresence>
                {/* Animated Form */}
                <div className="flex-1 flex items-center justify-center px-6 py-10 relative h-full z-20">
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.div
                                key="login-form"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="w-full"
                            >
                                <LoginPage />
                                <div className="text-center pt-4">
                                    <span className="text-gray-900 text-sm">Don't have an account? </span>
                                    <button
                                        className="text-primary hover:underline font-medium text-sm"
                                        onClick={() => setIsLogin(false)}
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register-form"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="w-full"
                            >
                                <Register />
                                <div className="text-center pt-4">
                                    <span className="text-gray-900 text-sm">Already have an account? </span>
                                    <button
                                        className="text-primary hover:underline font-medium text-sm"
                                        onClick={() => setIsLogin(true)}
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
} 