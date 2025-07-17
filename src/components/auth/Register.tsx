import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { register as registerApi } from "@/api/auth";
import AOS from "aos";

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
        const newErrors: {
            username?: string;
            email?: string;
            phone?: string;
            password?: string;
            api?: string;
        } = {};
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
            navigate("/login");
        } catch (error: any) {
            setErrors({
                api: error?.response?.data?.message || "Registration failed. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                <p className="text-center text-lg text-white/80 mb-2">Create your account</p>
                {/* Register Card */}
                <Card className="backdrop-blur-sm bg-white/95 border-white/20">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl text-gray-900">Sign Up</CardTitle>
                        <p className="text-base text-gray-900">Join your university community</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-medium text-gray-900">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className={`${errors.username ? 'border-destructive focus:border-destructive' : ''} text-gray-900 placeholder:text-primary/70 bg-white/80`}
                                />
                                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your university email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className={`${errors.email ? 'border-destructive focus:border-destructive' : ''} text-gray-900 placeholder:text-primary/70 bg-white/80`}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-900">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className={`${errors.phone ? 'border-destructive focus:border-destructive' : ''} text-gray-900 placeholder:text-primary/70 bg-white/80`}
                                />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className={`${errors.password ? 'border-destructive focus:border-destructive' : ''} text-gray-900 placeholder:text-primary/70 bg-white/80 pr-10`}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-2 top-8 text-gray-500 hover:text-primary"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>
                            <Button
                                type="submit"
                                className="w-full font-semibold rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-primary transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing up..." : "Sign Up"}
                            </Button>
                            {errors.api && <p className="text-sm text-destructive text-center">{errors.api}</p>}
                        </form>
                        <div className="text-center">
                            <p className="text-sm text-gray-900">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <p className="text-center text-sm text-white/60">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}