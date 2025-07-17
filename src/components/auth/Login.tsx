import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Login() {
    const [mode, setMode] = useState<"phone" | "userpass">("phone");
    const [phone, setPhone] = useState("");
    const [phonePassword, setPhonePassword] = useState("");
    const [userpass, setUserpass] = useState({ email: "", password: "" });
    const [showPhonePassword, setShowPhonePassword] = useState(false);
    const [showUserPassPassword, setShowUserPassPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(phone, phonePassword);
            navigate("/", { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid phone or password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserPassLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(userpass.email, userpass.password);
            navigate("/", { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 700, once: true });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo and Branding */}
                <div
                    className="flex items-center justify-center gap-3 mb-2"
                >
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur flex items-center">
                        <BookOpen className="h-8 w-8 text-primary drop-shadow" />
                    </div>
                    <span
                        className="text-3xl font-extrabold tracking-tight text-white drop-shadow"
                        style={{ fontFamily: "Inter, Arial, sans-serif" }}
                    >
                        CampusConnect
                    </span>
                </div>
                <p className="text-center text-lg text-white/80 mb-2">Sign in to your account</p>
                {/* Login Card */}
                <Card className="backdrop-blur-sm bg-white/95 border-white/20">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
                        <p className="text-base text-gray-900">Welcome back to your university community</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Custom Bar Tabs */}
                        <div className="flex justify-center mb-4">
                            <div className="relative w-4/5 h-10 bg-gray-200 rounded-full flex items-center shadow-inner">
                                <button
                                    type="button"
                                    className={`w-1/2 h-8 mx-1 rounded-full font-medium transition-all duration-300 z-10 ${mode === "userpass"
                                        ? "bg-primary text-primary-foreground shadow"
                                        : "bg-transparent text-gray-700 hover:bg-primary/10"
                                        }`}
                                    onClick={() => setMode("userpass")}
                                    tabIndex={0}
                                >
                                    Email
                                </button>
                                <button
                                    type="button"
                                    className={`w-1/2 h-8 mx-1 rounded-full font-medium transition-all duration-300 z-10 ${mode === "phone"
                                        ? "bg-primary text-primary-foreground shadow"
                                        : "bg-transparent text-gray-700 hover:bg-primary/10"
                                        }`}
                                    onClick={() => setMode("phone")}
                                    tabIndex={0}
                                >
                                    Phone
                                </button>
                                {/* Animated indicator */}
                                <span
                                    className="absolute top-1 left-1 h-8 w-[calc(50%-0.5rem)] rounded-full bg-primary transition-all duration-300 z-0"
                                    style={{
                                        transform: mode === "userpass" ? "translateX(0)" : "translateX(100%)"
                                    }}
                                />
                            </div>
                        </div>
                        {/* Animated Slider Content */}
                        <div className="space-y-4">
                            {mode === "userpass" && (
                                <form onSubmit={handleUserPassLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your.email@university.edu"
                                            className="text-gray-900 placeholder:text-primary/70 bg-white/80"
                                            value={userpass.email}
                                            onChange={e => setUserpass({ ...userpass, email: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
                                        <Input
                                            id="password"
                                            type={showUserPassPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="text-gray-900 placeholder:text-primary/70 bg-white/80 pr-10"
                                            value={userpass.password}
                                            onChange={e => setUserpass({ ...userpass, password: e.target.value })}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-2 top-8 text-gray-500 hover:text-primary"
                                            onClick={() => setShowUserPassPassword(v => !v)}
                                        >
                                            {showUserPassPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full font-semibold rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-primary transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Login"}
                                    </Button>
                                </form>
                            )}
                            {mode === "phone" && (
                                <form onSubmit={handlePhoneLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="9876543210"
                                            className="text-gray-900 placeholder:text-primary/70 bg-white/80"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <Label htmlFor="phone-password" className="text-sm font-medium text-gray-900">Password</Label>
                                        <Input
                                            id="phone-password"
                                            type={showPhonePassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="text-gray-900 placeholder:text-primary/70 bg-white/80 pr-10"
                                            value={phonePassword}
                                            onChange={e => setPhonePassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-2 top-8 text-gray-500 hover:text-primary"
                                            onClick={() => setShowPhonePassword(v => !v)}
                                        >
                                            {showPhonePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full font-semibold rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-primary transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Login"}
                                    </Button>
                                </form>
                            )}
                        </div>
                        {error && <p className="text-sm text-destructive text-center">{error}</p>}
                        <div className="text-center">
                            <p className="text-sm text-gray-900">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <p className="text-center text-sm text-white/60">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}