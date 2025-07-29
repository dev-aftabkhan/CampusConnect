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
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(identifier, password);
            navigate("/", { replace: true });
            // No reload, rely on state/context for live update
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid credentials");
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
                        {/* Single Login Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="identifier" className="text-sm font-medium text-gray-900">Email or Phone</Label>
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="your.email@university.edu or 9876543210"
                                    className="text-gray-900 placeholder:text-primary/70 bg-white/80"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="text-gray-900 placeholder:text-primary/70 bg-white/80 pr-10"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-2 top-8 text-gray-500 hover:text-primary"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <Button
                                type="submit"
                                className="w-full font-semibold rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-primary transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Login"}
                            </Button>
                            {error && <div className="text-destructive text-center text-sm font-medium mt-2">{error}</div>}
                        </form>
                        <div className="text-center mt-4">
                            <span className="text-gray-900">Don't have an account? </span>
                            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
                        </div>
                    </CardContent>
                </Card>
                
            </div>
        </div>
    );
}