import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filtercard";
import Job1 from "./Job1"; // or JobCards if you want to use that instead
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (!searchedQuery || Object.keys(searchedQuery).length === 0) {
      setFilterJobs(allJobs);
      return;
    }

    const { Location, Technology, Experience, Salary } = searchedQuery;

    const filteredJobs = allJobs.filter((job) => {
      const matchesLocation =
        !Location ||
        job.location?.toLowerCase() === Location.toLowerCase();

      const matchesTechnology =
        !Technology ||
        job.technology?.toLowerCase() === Technology.toLowerCase();

      const matchesExperience =
        !Experience ||
        Number(job.experience) === Number(Experience);

      const matchesSalary =
        !Salary || Number(job.salary) === Number(Salary);

      return (
        matchesLocation &&
        matchesTechnology &&
        matchesExperience &&
        matchesSalary
      );
    });

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-1/5">
            <FilterCard />
          </div>

          {filterJobs.length <= 0 ? (
            <span className="text-gray-500 font-semibold">
              Job not found
            </span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    key={job._id} // ✅ Use _id instead of id
                  >
                    <Job1 job={job} />
                    {/* Or <JobCards job={job} /> if you want that version */}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
