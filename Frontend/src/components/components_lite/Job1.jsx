import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Bookmark, BookMarked } from "lucide-react";

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!job) return null;

  const daysAgo = (() => {
    if (!job?.createdAt) return "N/A";
    const createdAt = new Date(job.createdAt);
    const now = new Date();
    const diff = now - createdAt;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} days ago`;
  })();

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{daysAgo}</p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          {isBookmarked ? <BookMarked /> : <Bookmark />}
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo || ""} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">
            {job?.company?.name || "Company Name"}
          </h1>
          <p className="text-sm text-gray-500">
            {job?.location || "Location not specified"}
          </p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title || "Job Title"}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">
          {job?.description || "No description provided."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position || 1} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType || "N/A"}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary ? `${job.salary} LPA` : "Salary not specified"}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        <Button className="bg-[#7209b7] text-white">Save For Later</Button>
      </div>
    </div>
  );
};

export default Job1;
