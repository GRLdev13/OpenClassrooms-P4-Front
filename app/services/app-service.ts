// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginUserDTO } from "~/dto/user/LoginUserDTO";
import type { RegisterUserDTO } from "~/dto/user/RegisterUserDTO";
import type { LoggedUserDTO } from "~/dto/user/LoggedUserDTO";
import type { DeleteUserDTO } from "~/dto/user/DeleteUserDTO";
import type { GetFileDto } from "~/dto/file/GetFileDto";
import type { DeleteFileDto } from "~/dto/file/DeleteFileDto";
import type { DownloadFileDto } from "~/dto/file/DownloadFileDto";
import type { GetTagDto } from "~/dto/tag/GetTagDto";
import type { AddTagDto } from "~/dto/tag/AddTagDto";
import type { CreateFileDto } from "~/dto/file/CreateFileDto";


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
      console.log("token set ?", state?.user?.token ? state?.user?.token : lToken);
      //TODO: XSRF token + laravel token
    },
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    putRegister: builder.mutation<RegisterUserDTO, Partial<RegisterUserDTO>>({
      query: (user) => ({
        url: `register`,
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
        url: `login`,
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
      getFiles: builder.query<GetFileDto[], string>({
      query: (name) => `file/all`,
    }),
    downloadFile: builder.mutation<Blob, Pick<DownloadFileDto, "id">>({
      query: (file) => ({
        url: `file/${file.id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
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
      query: () => `tags`,
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
export const { useDownloadFileMutation } = dashBoardApi;
export const { useDeleteFileMutation } = dashBoardApi;
