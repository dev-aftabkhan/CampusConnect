import { useState, useEffect } from "react";
import "@/styles/scrollbar.css";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { register as registerApi } from "@/api/auth";
import AOS from "aos";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        phone?: string;
        password?: string;
        api?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 700, once: true });
    }, []);

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone is required";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            await registerApi(formData.username, formData.email, formData.phone, formData.password);
            toast({
                title: "Registration successful! Redirecting to login...",
                variant: "default",
            });
            setTimeout(() => navigate("/login"), 1200);
        } catch (error: any) {
            toast({
                title: error?.response?.data?.message || "Registration failed. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f3ef] px-4">
            <div className="w-full max-w-4xl h-[90vh] flex md:flex-row rounded-2xl shadow-2xl border border-white/40 bg-white/60 backdrop-blur-lg overflow-hidden">
                {/* Left - Form */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative ">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-4 mt-2 ">
                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur flex items-center">
                            <BookOpen className="h-6 w-6 text-primary drop-shadow" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-primary drop-shadow" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
                            CampusConnect
                        </span>
                    </div>
                    <div className="w-full max-w-md flex flex-col justify-center space-y-6">
                        <Card className="bg-white/80 border-none shadow-none">
                            <CardHeader className="text-center pb-0">
                                <CardTitle className="text-2xl text-gray-900 font-bold">Sign Up</CardTitle>
                                <p className="text-sm text-gray-700 mt-1">Join your university community</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Username */}
                                    <div className="space-y-1">
                                        <Label htmlFor="username" className="text-sm text-gray-900">Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="john_doe"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            className={`${errors.username ? 'border-destructive' : ''} text-gray-900 placeholder:text-gray-400 bg-white/80`}
                                            required
                                            disabled={isLoading}
                                        />
                                        {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                                    </div>
                                    {/* Email */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-sm text-gray-900">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.edu"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className={`${errors.email ? 'border-destructive' : ''} text-gray-900 placeholder:text-gray-400 bg-white/80`}
                                            required
                                            disabled={isLoading}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>
                                    {/* Phone */}
                                    <div className="space-y-1">
                                        <Label htmlFor="phone" className="text-sm text-gray-900">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className={`${errors.phone ? 'border-destructive' : ''} text-gray-900 placeholder:text-gray-400 bg-white/80`}
                                            required
                                            disabled={isLoading}
                                        />
                                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                    </div>
                                    {/* Password */}
                                    <div className="space-y-1 relative">
                                        <Label htmlFor="password" className="text-sm text-gray-900">Password</Label>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className={`${errors.password ? 'border-destructive' : ''} text-gray-900 placeholder:text-gray-400 bg-white/80 pr-10`}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-[36px] text-gray-500 hover:text-primary"
                                            onClick={() => setShowPassword(v => !v)}
                                            tabIndex={-1}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                    </div>
                                    {/* Notification */}
                                    {/* Removed notification banner, now using toast */}
                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        className="w-full h-11 font-semibold rounded-md bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-primary transition-all"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing up..." : "Sign Up"}
                                    </Button>
                                    {errors.api && <p className="text-sm text-destructive text-center">{errors.api}</p>}
                                </form>
                                {/* Redirect */}
                                <div className="text-center pt-2">
                                    <span className="text-gray-900 text-sm">Already have an account? </span>
                                    <Link to="/login" className="text-primary hover:underline font-medium text-sm">Sign in</Link>
                                </div>
                            </CardContent>
                        </Card>
                        <p className="text-center text-xs text-gray-600">
                            By signing up, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
                {/* Right - Illustration */}
                <div className="hidden md:flex flex-1 items-center justify-center bg-[#f5f3ef] px-10">
                    <img
                        src="/assets/campus-ref.svg"
                        alt="Campus students illustration"
                        className="w-72 md:w-80 h-auto"
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
}
