import {useQuery} from "@tanstack/react-query";
import {getAllHosts} from "../../services/host.api";
import {useState} from "react";

export const useHosts = (queryParams = {}) => {

  return useQuery({
    queryKey: [
      "hosts", queryParams
    ],
    queryFn: () => getAllHosts(queryParams),
   
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    keepPreviousData: true,
    retry: 2,
    refetchOnWindowFocus: false
  });
};

export const usePaginatedHosts = (initialParams = {
  page: 1,
  limit: 10
}) => {
  const [queryParams, setQueryParams] = useState(initialParams);

  const {data, isLoading, isError, error, isFetching} = useHosts(queryParams);

  const goToPage = page => {
    setQueryParams(prev => ({
      ...prev,
      page
    }));
  };

  const changeLimit = limit => {
    setQueryParams(prev => ({
      ...prev,
      limit,
      page: 1
    }));
  };

  const changeSort = (sortBy, sortOrder) => {
    setQueryParams(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  const applyFilters = filters => {
    setQueryParams(prev => ({
      ...prev,
      ...filters,
      page: 1
    }));
  };

  return {
    hosts: data
      ?.data
        ?.hosts || [],
    pagination: data
      ?.data
        ?.pagination || {},
    isLoading,
    isFetching,
    isError,
    error,
    queryParams,
    actions: {
      goToPage,
      changeLimit,
      changeSort,
      applyFilters
    }
  };
};

export const useFeaturedHosts = (limit = 4) => {
  return useHosts({isFeatured: true, status: "active", limit, sortBy: "featuredUntil", sortOrder: "desc"});
};

export const useActiveHosts = (queryParams = {}) => {
  return useHosts({
    status: "active",
    ...queryParams
  });
};