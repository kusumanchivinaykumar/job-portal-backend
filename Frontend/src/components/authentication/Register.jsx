import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  // Handle input change
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const fileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // Form submit
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.role) return toast.error("Please select a role");
    if (!input.file) return toast.error(input.role === "Student" ? "Profile photo is required" : "Resume is required");

    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("password", input.password);
      formData.append("role", input.role);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("pancard", input.pancard);
      formData.append("adharcard", input.adharcard);

      // Append correct file field
      if (input.role === "Student") {
        formData.append("profilePhoto", input.file); // must match multer field
      } else if (input.role === "Recruiter") {
        formData.append("resume", input.file); // must match multer field
      }

      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md p-6 bg-white border rounded-md shadow-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Register</h1>

        {/* Fullname */}
        <div className="mb-3">
          <label className="block mb-1">Fullname</label>
          <input
            type="text"
            name="fullname"
            value={input.fullname}
            onChange={changeHandler}
            placeholder="John Doe"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            placeholder="johndoe@gmail.com"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            placeholder="********"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* PAN Card */}
        <div className="mb-3">
          <label className="block mb-1">PAN Card Number</label>
          <input
            type="text"
            name="pancard"
            value={input.pancard}
            onChange={changeHandler}
            placeholder="ABCDEF1234G"
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Aadhar Card */}
        <div className="mb-3">
          <label className="block mb-1">Aadhar Card Number</label>
          <input
            type="text"
            name="adharcard"
            value={input.adharcard}
            onChange={changeHandler}
            placeholder="123456789012"
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeHandler}
            placeholder="+911234567890"
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="block mb-1">Role</label>
          <select
            name="role"
            value={input.role}
            onChange={changeHandler}
            className="w-full border px-3 py-2 rounded-md"
            required
          >
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Recruiter">Recruiter</option>
          </select>
        </div>

        {/* File Upload */}
        {input.role && (
          <div className="mb-3">
            <label className="block mb-1">{input.role === "Recruiter" ? "Upload Resume" : "Profile Photo"}</label>
            <input
              type="file"
              accept={input.role === "Recruiter" ? ".pdf,.doc,.docx" : "image/*"}
              onChange={fileHandler}
              className="w-full"
              required
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
