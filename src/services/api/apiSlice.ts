import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Appraisal,
  Client,
  User,
  Role,
  ComparisonReference,
  AppraisalReference,
  Document,
} from '../../types';
import type { UpsertAppraisalSchemaType } from '../../features/appraisal/schema';
import { getAccessToken } from '../auth/auth-storage';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://rivia-tasaciones-1020531793875.us-central1.run.app';
    let url = typeof args === 'string' ? args : args.url;
    const fullUrl = url.startsWith('http') ? url : baseUrl + url;
    const token = await getAccessToken();
    const headers = new Headers(typeof args === 'object' && args.headers ? args.headers : {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    const method = typeof args === 'object' && args.method ? args.method : 'GET';
    const body = typeof args === 'object' && args.body ? JSON.stringify(args.body) : undefined;

    console.log(`📡 API Request: ${method} ${fullUrl}`, { headers: Object.fromEntries(headers), body: typeof args === 'object' ? args.body : undefined });
    const result = await fetchBaseQuery({
      baseUrl,
      prepareHeaders: async (headers) => {
        const token = await getAccessToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
      }
    })(args, api, extraOptions);
    console.log('📡 API Response:', result);
    return result;
  },
  tagTypes: ['Appraisal', 'Client', 'User', 'Role', 'ComparisonReference', 'AppraisalReference', 'Document'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/mobile/auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Appraisal endpoints
    getAppraisals: builder.query<Appraisal[], void>({
      query: () => '/appraisal',
      providesTags: ['Appraisal'],
    }),
    getAppraisalById: builder.query<Appraisal, string>({
      query: (id) => `/appraisal/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appraisal', id }],
    }),
    createAppraisal: builder.mutation<Appraisal, UpsertAppraisalSchemaType>({
      query: (appraisal) => ({
        url: '/appraisal',
        method: 'POST',
        body: appraisal,
      }),
      invalidatesTags: ['Appraisal'],
    }),
    updateAppraisal: builder.mutation<Appraisal, { id: string; data: Partial<Appraisal> }>({
      query: ({ id, data }) => ({
        url: `/appraisal/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Appraisal', id }],
    }),
    deleteAppraisal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/appraisal/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appraisal'],
    }),
    
    // Client endpoints
    getClients: builder.query<Client[], void>({
      query: () => '/client',
      providesTags: ['Client'],
    }),
    getClientById: builder.query<Client, number>({
      query: (id) => `/client/${id}`,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    
    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/user',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    // Role endpoints
    getRoles: builder.query<Role[], void>({
      query: () => '/role',
      providesTags: ['Role'],
    }),
    
    // Comparison Reference endpoints
    getComparisonReferences: builder.query<ComparisonReference[], void>({
      query: () => '/comparison-reference',
      providesTags: ['ComparisonReference'],
    }),
    
    // Appraisal Reference endpoints
    getAppraisalReferences: builder.query<AppraisalReference[], void>({
      query: () => '/appraisal-reference',
      providesTags: ['AppraisalReference'],
    }),
    
    // Document endpoints
    getDocuments: builder.query<Document[], void>({
      query: () => '/document',
      providesTags: ['Document'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useGetAppraisalsQuery,
  useGetAppraisalByIdQuery,
  useCreateAppraisalMutation,
  useUpdateAppraisalMutation,
  useDeleteAppraisalMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetRolesQuery,
  useGetComparisonReferencesQuery,
  useGetAppraisalReferencesQuery,
  useGetDocumentsQuery,
} = apiSlice;
