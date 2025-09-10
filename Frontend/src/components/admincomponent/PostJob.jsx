import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validJobTypes = [
    "Full-Time",
    "Part-Time",
    "Internship",
    "Contract",
    "Remote",
    "Hybrid",
  ];

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    // Required fields validation
    const requiredFields = [
      "title",
      "description",
      "location",
      "salary",
      "jobType",
      "experience",
      "position",
      "companyId",
    ];

    for (const field of requiredFields) {
      if (!input[field]) {
        return toast.error(`${field} is required`);
      }
    }

    // Validate jobType
    if (!validJobTypes.includes(input.jobType)) {
      return toast.error("Invalid Job Type selected");
    }

    // Convert numeric fields
    const salaryNum = Number(input.salary);
    const experienceNum = Number(input.experience);
    const positionNum = Number(input.position);

    if (isNaN(salaryNum) || isNaN(experienceNum) || isNaN(positionNum)) {
      return toast.error("Salary, Experience, and Position must be numbers");
    }

    // Prepare requirements array
    const requirementsArray = input.requirements
      ? input.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean)
      : [];

    const jobData = {
      title: input.title,
      description: input.description,
      location: input.location,
      salary: salaryNum,
      jobType: input.jobType,
      experience: experienceNum,
      position: positionNum,
      companyId: input.companyId,
      requirements: requirementsArray,
    };

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_ENDPOINT}/jobs`, jobData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Job posted successfully");
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Post Job Error:", error);
      if (error.response?.data) {
        toast.error(error.response.data.message || "Server Error");
      } else {
        toast.error(error.message || "Unexpected Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-500 shadow-sm hover:shadow-xl rounded-lg"
        >
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                placeholder="Enter job title"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                placeholder="Enter job description"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                placeholder="Enter job location"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Salary (LPA)</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                placeholder="Enter salary"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                placeholder="Number of positions"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Requirements (comma separated)</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                placeholder="e.g., JavaScript, React, Node"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Experience (Years)</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                placeholder="Experience in years"
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Select
                onValueChange={(value) => setInput({ ...input, jobType: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {validJobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Company</Label>
              {companies.length > 0 ? (
                <Select
                  onValueChange={(value) =>
                    setInput({ ...input, companyId: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-bold my-3 text-center text-red-600">
                  *Please register a company to post jobs.*
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center mt-5">
            {loading ? (
              <Button
                className="w-full flex items-center justify-center gap-2"
                disabled
              >
                <Loader2 className="animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-black hover:bg-blue-600 text-white"
              >
                Post Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
