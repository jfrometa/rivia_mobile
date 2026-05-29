import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../services/api/role";

export const roleQueryKeys = {
  all: ["roles"] as const,
  lists: () => [...roleQueryKeys.all, "list"] as const,
};

export function useRolesQuery() {
  return useQuery({
    queryKey: roleQueryKeys.lists(),
    queryFn: getRoles,
  });
}
