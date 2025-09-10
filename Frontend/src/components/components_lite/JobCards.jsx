import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  if (!job) return null;

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-200 cursor-pointer hover:shadow-2xl hover:shadow-blue-200 hover:scale-[1.02] transition-all duration-200"
    >
      {/* Company Info */}
      <div>
        <h1 className="text-lg font-medium">
          {job.company?.name || "Company Name"}
        </h1>
        <p className="text-sm text-gray-600">
          {job.location || "Location not specified"}
        </p>
      </div>

      {/* Job Title & Description */}
      <div className="mt-2">
        <h2 className="font-bold text-lg my-2">
          {job.title || "Job Title"}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3">
          {job.description || "No description available."}
        </p>
      </div>

      {/* Job Details as Badges */}
      <div className="flex gap-2 items-center mt-4 flex-wrap">
        <Badge className="text-blue-600 font-bold" variant="ghost">
          {job.position || 1} Open Positions
        </Badge>
        <Badge className="text-[#FA4F09] font-bold" variant="ghost">
          {job.salary ? `${job.salary} LPA` : "Salary not specified"}
        </Badge>
        <Badge className="text-[#6B3AC2] font-bold" variant="ghost">
          {job.location || "Location not specified"}
        </Badge>
        <Badge className="text-black font-bold" variant="ghost">
          {job.jobType || "Job Type not specified"}
        </Badge>
      </div>
    </div>
  );
};

export default JobCards;
