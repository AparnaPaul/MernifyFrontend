import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cookies from "js-cookie";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user"); // Default role: User
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => { //FIXED HANDLER
    setRole(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) return toast.error("Email and Password are required");

    try {
      const apiUrl = role === "admin"
        ? "https://mernifyserver.onrender.com/api/admin/login"
        : "https://mernifyserver.onrender.com/api/user/login";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
        credentials: "include"
      });

      const result = await response.json();
      console.log("Login successful, response:", result); // Debugging

      const userData = result.user || result.admin; // Handle both cases
      const token = Cookies.get("token")

      if (result.success && userData) {
        login(userData.username, token, userData.role, userData.email);
       
        setTimeout(() => {
          navigate(role === "admin" ? "/adminDashboard" : "/"); // Redirect based on role
        }, 1000);
      } else {
        toast.error(result.error?.details?.[0]?.message || result.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="md:w-[400px] sm:w-[300px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Role Selection Dropdown */}
          <div>
            <Label>Login As</Label>
            <Select value={role} onValueChange={handleRoleChange}>  
              <SelectTrigger>
                <SelectValue>{role}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Input */}
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={loginInfo.email} onChange={handleChange} placeholder="Enter your email" />
          </div>

          {/* Password Input */}
          <div>
            <Label>Password</Label>
            <Input type="password" name="password" value={loginInfo.password} onChange={handleChange} placeholder="Enter your password" />
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Login;