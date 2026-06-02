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
      const rawBaseQuery = fetchBaseQuery({
        baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://rivia-tasaciones-1020531793875.us-central1.run.app',
        prepareHeaders: async (headers) => {
          const token = await getAccessToken();
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          headers.set('Content-Type', 'application/json');
          return headers;
        }
      });

      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://rivia-tasaciones-1020531793875.us-central1.run.app';
      const url = typeof args === 'string' ? args : args.url;
      const fullUrl = url.startsWith('http') ? url : baseUrl + url;
      const method = typeof args === 'object' && args.method ? args.method : 'GET';

      console.log(`📡 API Request: ${method} ${fullUrl}`, {
        headers: typeof args === 'object' && args.headers ? args.headers : {},
        body: typeof args === 'object' ? args.body : undefined
      });

      const result = await rawBaseQuery(args, api, extraOptions);
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
      transformResponse: (response: { data: any }) => response.data,
    }),
    
    // Appraisal endpoints
    getAppraisals: builder.query<Appraisal[], void>({
      query: () => '/appraisal/list',
      transformResponse: (response: { data: Appraisal[] }) => {
        return response.data.map(appraisal => {
          if (typeof appraisal.fields === 'string') {
            return { ...appraisal, fields: JSON.parse(appraisal.fields) };
          }
          return appraisal;
        });
      },
      providesTags: ['Appraisal'],
    }),
    getAppraisalById: builder.query<Appraisal, string>({
      query: (id) => `/appraisal/${id}`,
      transformResponse: (response: { data: Appraisal }) => {
        const appraisal = response.data;
        if (typeof appraisal.fields === 'string') {
          return { ...appraisal, fields: JSON.parse(appraisal.fields) };
        }
        return appraisal;
      },
      providesTags: (result, error, id) => [{ type: 'Appraisal', id }],
    }),
    createAppraisal: builder.mutation<Appraisal, UpsertAppraisalSchemaType>({
      query: (appraisal) => ({
        url: '/appraisal',
        method: 'POST',
        body: appraisal,
      }),
      transformResponse: (response: { data: Appraisal }) => {
        const appraisal = response.data;
        if (typeof appraisal.fields === 'string') {
          return { ...appraisal, fields: JSON.parse(appraisal.fields) };
        }
        return appraisal;
      },
      invalidatesTags: ['Appraisal'],
    }),
    updateAppraisal: builder.mutation<Appraisal, { id: string; data: Partial<Appraisal> }>({
      query: ({ id, data }) => ({
        url: `/appraisal/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { data: Appraisal }) => {
        const appraisal = response.data;
        if (typeof appraisal.fields === 'string') {
          return { ...appraisal, fields: JSON.parse(appraisal.fields) };
        }
        return appraisal;
      },
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
      query: () => '/clients',
      transformResponse: (response: { data: Client[] }) => response.data,
      providesTags: ['Client'],
    }),
    getClientById: builder.query<Client, number>({
      query: (id) => `/client/${id}`,
      transformResponse: (response: { data: Client }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    
    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (response: { data: User[] }) => response.data,
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
      transformResponse: (response: { data: User }) => response.data,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    // Role endpoints
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      transformResponse: (response: { data: Role[] }) => response.data,
      providesTags: ['Role'],
    }),
    
    // Comparison Reference endpoints
    getComparisonReferences: builder.query<ComparisonReference[], void>({
      query: () => '/comparison-references',
      transformResponse: (response: { data: ComparisonReference[] }) => response.data,
      providesTags: ['ComparisonReference'],
    }),
    
    // Appraisal Reference endpoints
    getAppraisalReferences: builder.query<AppraisalReference[], void>({
      query: () => '/appraisal-references',
      transformResponse: (response: { data: AppraisalReference[] }) => response.data,
      providesTags: ['AppraisalReference'],
    }),
    
    // Document endpoints
    getDocuments: builder.query<Document[], void>({
      query: () => '/documents',
      transformResponse: (response: { data: Document[] }) => response.data,
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
