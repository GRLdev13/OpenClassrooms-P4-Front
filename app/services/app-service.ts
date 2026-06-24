// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginUserDTO } from "~/dto/user/login-user-dto";
import type { RegisterUserDTO } from "~/dto/user/register-user-dto";
import type { LoggedUserDTO } from "~/dto/user/logged-user-dto";
import type { DeleteUserDTO } from "~/dto/user/delete-user-dto";
import type { GetFileDto } from "~/dto/file/get-file-dto";
import type { DeleteFileDto } from "~/dto/file/delete-file-dto";
import type { DownloadFileDto } from "~/dto/file/download-file-dto";
import type { GetTagDto } from "~/dto/tag/get-tag-dto";
import type { AddTagDto } from "~/dto/tag/add-tag-dto";
import type { RequestFilesDto } from "~/dto/file/request-files-dto";

// Define a service using a base URL and expected endpoints
export const dashBoardApi = createApi({
  reducerPath: "DashBoardApi",
  tagTypes: ["Dashboard"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      let state = getState() as any; //State saves every reference to other slices of redux states
      let lToken = localStorage.getItem("token");
      headers.set(
        "Authorization",
        `Bearer ${state?.user?.token ? state?.user?.token : lToken}`,
      );
      console.log(
        "token set ?",
        state?.user?.token ? state?.user?.token : lToken,
      );
      //TODO: XSRF token + token
    },
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    putRegister: builder.mutation<LoggedUserDTO, Partial<RegisterUserDTO>>({
    query: (user) => ({
        url: `/auth/register`,
        method: "POST",
        body: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          passwordConfirmation: user.passwordConfirmation,
        },
      }),
    }),
    putLogin: builder.mutation<LoggedUserDTO, Partial<LoginUserDTO>>({
      query: (user) => ({
        url: `/user/login`,
        method: "POST",
        body: {
          email: user.email,
          password: user.password,
        },
      }),
    }),
    deleteUser: builder.mutation<DeleteUserDTO, Partial<DeleteUserDTO>>({
      query: (user) => ({
        url: `user`,
        method: "DELETE",
        body: {
          email: user.email,
          password: user.password,
          passwordConfirmation: user.passwordConfirmation,
        },
      }),
    }),
    uploadFile: builder.mutation<string, FormData>({
      query: (formData) => ({
        url: `file/upload`,
        method: "POST",
        body: formData,
      }),
    }),
    getFiles: builder.query<GetFileDto[], RequestFilesDto>({
        query: (query) => ({
        url: `file`,
        method: "POST",
        body: query,
      }),
    }),
    downloadFileLink: builder.mutation<GetFileDto, string>({
      query: (link) => ({
        url: `file/link/${link}`,
        method: "GET",
      }),
    }),
    downloadFile: builder.mutation<Blob, DownloadFileDto>({
      query: (file) => ({
        url: `file/download`,
        method: "POST",
        body: {
          id: file.id,
          password: file.password,
        },
        responseHandler: async (response) => {
          if (response.ok) {
            return response.blob();
          }

          const contentType = response.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            return response.json();
          }

          return response.text();
        },
      }),
    }),
    deleteFile: builder.mutation<void, Partial<DeleteFileDto>>({
      query: (file) => ({
        url: `file/delete/${file.id}`,
        method: "DELETE",
      }),
    }),
    addTag: builder.mutation<GetTagDto, Partial<AddTagDto>>({
      query: (tag) => ({
        url: `tags`,
        method: "POST",
        body: {
          name: tag.name,
        },
      }),
    }),
    getTags: builder.query<GetTagDto[], void>({
      query: () => `tag/all`,
      providesTags: ["Dashboard"],
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `tags/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { usePutLoginMutation } = dashBoardApi;
export const { usePutRegisterMutation } = dashBoardApi;
export const { useDeleteUserMutation } = dashBoardApi;
export const { useUploadFileMutation } = dashBoardApi;
export const { useGetFilesQuery } = dashBoardApi;
export const { useDownloadFileLinkMutation } = dashBoardApi;
export const { useDownloadFileMutation } = dashBoardApi;
export const { useDeleteFileMutation } = dashBoardApi;
export const { useGetTagsQuery } = dashBoardApi;
