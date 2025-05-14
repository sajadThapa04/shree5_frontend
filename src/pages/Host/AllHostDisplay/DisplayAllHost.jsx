import { Link } from "react-router-dom";
import { MapPinIcon, StarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { usePaginatedHosts } from "../../../hooks/hostApiHooks/useGetAllHosts";
import { Button } from "../../../components/Ui";
import { useEffect, useState } from "react";

const HostsGrid = () => {
  const {
    hosts,
    pagination,
    isLoading,
    isFetching,
    actions: { goToPage, changeLimit, applyFilters },
  } = usePaginatedHosts();

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("featured");

  // Apply filters when they change
  useEffect(() => {
    if (activeFilter === "all") {
      applyFilters({});
    } else {
      applyFilters({ status: activeFilter });
    }
  }, [activeFilter, applyFilters]);

  // Apply sorting
  useEffect(() => {
    if (sortOption === "featured") {
      applyFilters({ sortBy: "featuredUntil", sortOrder: "desc" });
    } else if (sortOption === "newest") {
      applyFilters({ sortBy: "createdAt", sortOrder: "desc" });
    } else if (sortOption === "rating") {
      applyFilters({ sortBy: "averageRating", sortOrder: "desc" });
    }
  }, [sortOption, applyFilters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Featured Hosts</h1>
            <p className="text-gray-600 mt-2">
              Discover unique places to stay, restaurants, and experiences
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "all" ? "primary" : "outline"}
              onClick={() => setActiveFilter("all")}
            >
              All Hosts
            </Button>
            <Button
              variant={activeFilter === "active" ? "primary" : "outline"}
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "featured" ? "primary" : "outline"}
              onClick={() => setActiveFilter("featured")}
            >
              Featured
            </Button>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Hosts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hosts.map((host) => (
            <Link
              key={host._id}
              to={`/hosts/${host._id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="relative">
                <img
                  src={host.coverImage || "/placeholder-host.jpg"}
                  alt={host.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <HeartIcon className="h-5 w-5 text-gray-700" />
                </button>
                {host.isFeatured && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-rose-600 transition-colors">
                    {host.name}
                  </h3>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-rose-500 fill-rose-500" />
                    <span className="text-sm ml-1">
                      {host.averageRating?.toFixed(1) || "New"}
                    </span>
                  </div>
                </div>

                <div className="mt-1 flex items-center text-gray-600 text-sm">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="truncate">
                    {host.address?.street && `${host.address.street}, `}
                    {host.address?.city}
                    {host.address?.country && `, ${host.address.country}`}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-900 font-medium">
                    ${host.startingPrice?.toFixed(2) || "N/A"}
                    <span className="text-gray-600 font-normal"> / night</span>
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {host.listingType}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{hosts.length}</span> of{" "}
                <span className="font-medium">{pagination.totalDocs}</span>{" "}
                hosts
              </span>
              <select
                className="text-sm border-gray-300 rounded"
                value={pagination.limit}
                onChange={(e) => changeLimit(Number(e.target.value))}
              >
                {[4, 8, 12, 16].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => goToPage(pagination.page - 1)}
              >
                Previous
              </Button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={pagination.page === i + 1 ? "primary" : "outline"}
                  onClick={() => goToPage(i + 1)}
                  className="w-10"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => goToPage(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostsGrid;
