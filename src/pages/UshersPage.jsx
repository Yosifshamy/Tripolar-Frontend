import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { ushersAPI } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STATIC_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5000";

const UshersPage = () => {
  const [ushers, setUshers] = useState([]);
  const [filteredUshers, setFilteredUshers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchUshers();
  }, []);

  useEffect(() => {
    filterUshers();
  }, [ushers, searchTerm, skillFilter]);

  const fetchUshers = async () => {
    try {
      const response = await ushersAPI.getAll();
      if (response.data.success) {
        setUshers(response.data.ushers);

        const skills = new Set();
        response.data.ushers.forEach((usher) => {
          if (usher.profile?.skills) {
            usher.profile.skills.forEach((skill) => skills.add(skill));
          }
        });
        setAllSkills(Array.from(skills).sort());
      }
    } catch (error) {
      console.error("Error fetching ushers:", error);
      setError("Failed to load ushers");
    } finally {
      setLoading(false);
    }
  };

  const filterUshers = () => {
    let filtered = ushers;

    if (searchTerm) {
      filtered = filtered.filter(
        (usher) =>
          usher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usher.profile?.bio
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          usher.profile?.experience
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (skillFilter) {
      filtered = filtered.filter((usher) =>
        usher.profile?.skills?.includes(skillFilter)
      );
    }

    setFilteredUshers(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSkillFilter("");
  };

  const handleImageError = (usherId) => {
    setImageErrors((prev) => ({ ...prev, [usherId]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-black flex items-center justify-center pt-16">
        <Loading className="text-secondary-white" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-primary-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-light text-secondary-white mb-4 tracking-wide">
            OUR PROFESSIONAL USHERS
          </h1>
          <div className="w-24 h-px bg-secondary-white mx-auto mb-4"></div>
          <p className="text-gray-300 text-base max-w-2xl mx-auto font-light">
            Meet our team of experienced professionals dedicated to making your
            events exceptional
          </p>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8 p-4 bg-primary-rich-black border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, bio, or experience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-primary-dark-gray border border-gray-600 text-secondary-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors"
              />
            </div>

            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-primary-dark-gray border border-gray-600 text-secondary-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-white focus:border-secondary-white transition-colors appearance-none cursor-pointer"
              >
                <option value="">All Skills</option>
                {allSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full text-sm py-2.5"
            >
              CLEAR FILTERS
            </Button>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Showing {filteredUshers.length} of {ushers.length} ushers
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="text-center text-error-500 mb-6 text-sm">{error}</div>
        )}

        {/* Ushers Grid */}
        {filteredUshers.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg">No ushers found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUshers.map((usher, index) => (
              <motion.div
                key={usher._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="h-full"
              >
                <Card className="overflow-hidden bg-primary-rich-black border border-gray-800 hover:border-secondary-white transition-all duration-300 group h-full flex flex-col">
                  {/* Profile Image - FIXED */}
                  <div className="relative w-full h-56 overflow-hidden bg-primary-dark-gray flex-shrink-0">
                    {usher.profile?.profileImage && !imageErrors[usher._id] ? (
                      <img
                        src={`${STATIC_URL}${usher.profile.profileImage}`}
                        alt={`${usher.name}'s profile`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          console.error("Image load failed:", e.target.src);
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "block";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <UserCircleIcon className="w-24 h-24 text-gray-500" />
                      </div>
                    )}
                    {usher.profile?.availability ? (
                      <div className="absolute top-3 right-3 bg-success-500 text-white px-2.5 py-1 text-xs uppercase tracking-wide">
                        Available
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-gray-600 text-white px-2.5 py-1 text-xs uppercase tracking-wide">
                        Unavailable
                      </div>
                    )}
                  </div>

                  {/* Usher Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-display font-light text-secondary-white mb-1.5 tracking-wide">
                      {usher.name}
                    </h3>

                    {usher.profile?.experience && (
                      <p className="text-xs text-gray-400 mb-2.5">
                        {usher.profile.experience}
                      </p>
                    )}

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed flex-grow">
                      {usher.profile?.bio ||
                        "Professional usher with extensive experience in event management."}
                    </p>

                    {usher.profile?.skills &&
                      usher.profile.skills.length > 0 && (
                        <div className="mt-auto pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {usher.profile.skills
                              .slice(0, 3)
                              .map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 bg-primary-dark-gray text-secondary-white text-xs uppercase tracking-wide border border-gray-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            {usher.profile.skills.length > 3 && (
                              <span className="px-2.5 py-0.5 text-gray-400 text-xs">
                                +{usher.profile.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UshersPage;
