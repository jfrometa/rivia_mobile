import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/api/user";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
};

export function useUsersQuery() {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: getUsers,
  });
}
