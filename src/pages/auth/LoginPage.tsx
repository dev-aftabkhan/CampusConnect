import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Mail } from "lucide-react";
import { login } from "@/api/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(formData.identifier, formData.password);
      setNotification({ message: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => setNotification({ message: "", type: null }), 5000);
      setTimeout(() => {
        navigate("/", { replace: true });
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setNotification({ message: err?.response?.data?.message || "Invalid credentials", type: "error" });
      setTimeout(() => setNotification({ message: "", type: null }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3ef] px-4">
      <div className="w-full max-w-4xl h-[90vh] flex md:flex-row rounded-2xl shadow-2xl border border-white/40 bg-white/60 backdrop-blur-lg overflow-hidden">
        {/* Left - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 relative h-full">
          <div className="w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur flex items-center">
                <BookOpen className="h-6 w-6 text-primary drop-shadow" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-primary drop-shadow" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
                CampusConnect
              </span>
            </div>
            <Card className="bg-white/80 border-none shadow-none">
              <CardHeader className="text-center pb-0">
                <CardTitle className="text-2xl text-gray-900 font-bold">Sign In</CardTitle>
                <p className="text-sm text-gray-700 mt-1">Welcome back to your university community</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Username/Email */}
                  <div className="space-y-1">
                    <Label htmlFor="identifier" className="text-sm text-gray-900">Email or Phone</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="your@email.com or 9876543210"
                      value={formData.identifier}
                      onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                      className="text-gray-900 placeholder:text-gray-400 bg-white/80"
                      required
                      disabled={isLoading}
                    />
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
                      className="text-gray-900 placeholder:text-gray-400 bg-white/80 pr-10"
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
                  </div>
                  {/* Notification */}
                  {notification.message && (
                    <div
                      className={`rounded-md px-4 py-2 text-center font-medium transition-all duration-300 text-sm
                        ${notification.type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}
                    >
                      {notification.message}
                    </div>
                  )}
                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold rounded-md bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-primary transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                {/* Redirect */}
                <div className="text-center pt-2">
                  <span className="text-gray-900 text-sm">Don't have an account? </span>
                  <Link to="/register" className="text-primary hover:underline font-medium text-sm">Sign up</Link>
                </div>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-gray-600">
              By signing in, you agree to our Terms of Service and Privacy Policy
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