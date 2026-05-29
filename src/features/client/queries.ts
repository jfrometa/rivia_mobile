import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../services/api/clientFeature";

export const clientQueryKeys = {
  all: ["clients"] as const,
  lists: () => [...clientQueryKeys.all, "list"] as const,
};

export function useClientsQuery() {
  return useQuery({
    queryKey: clientQueryKeys.lists(),
    queryFn: getClients,
  });
}
