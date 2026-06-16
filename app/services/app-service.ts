// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LoginUserDTO,
  RegisterUserDTO,
  UpdateUserDTO,
  LoggedUserDTO,
  DeleteUserDTO,
  UpdateUserPasswordDTO,
} from "~/app/dto/UserDTO";
import type {
  FileDto,
  CreateFileDto,
  GetFileDto,
  DeleteFileDto,
  DownloadFileDto,
} from "~/app/dto/file/fileDTo";

// Define a service using a base URL and expected endpoints
export const dashBoardApi = createApi({
  reducerPath: "DashBoardApi",
  tagTypes: ["Dashboard"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://back.test/",
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
    updateUser: builder.mutation<UpdateUserDTO, Partial<UpdateUserDTO>>({
      query: (user) => ({
        url: `user`,
        method: "POST",
        body: {
          firstName: user.firstName,
          lastName: user.lastName,
          new_email: user.new_email,
          old_email: user.old_email,
        },
      }),
    }),
    updateUserPassword: builder.mutation<boolean, Partial<UpdateUserPasswordDTO>>({
      query: (user) => ({
        url: `user/password`,
        method: "POST",
        body: {
          email: user.email,
          password: user.password,
          new_password: user.new_password,
          confirm_password: user.confirm_password,
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
    uploadFile: builder.mutation<FileDto, Partial<CreateFileDto>>({
      query: (file) => ({
        url: `files`,
        method: "POST",
        body: {
          id: file.id,
          base64: file.base64,
          expirationDate: file.expirationDate,
        },
      }),
    }),
    getFile: builder.mutation<GetFileDto, Partial<GetFileDto>>({
      query: (file) => ({
        url: `files/${file.id}`,
        method: "GET",
      }),
    }),
    downloadFile: builder.mutation<DownloadFileDto, Partial<DownloadFileDto>>({
      query: (file) => ({
        url: `files/${file.id}/download`,
        method: "GET",
      }),
    }),
    deleteFile: builder.mutation<void, Partial<DeleteFileDto>>({
      query: (file) => ({
        url: `files/${file.id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { usePutLoginMutation } = dashBoardApi;
export const { usePutRegisterMutation } = dashBoardApi;
export const { useUpdateUserMutation } = dashBoardApi;
export const { useUpdateUserPasswordMutation } = dashBoardApi;
export const { useDeleteUserMutation } = dashBoardApi;
export const { useUploadFileMutation } = dashBoardApi;
export const { useGetFileMutation } = dashBoardApi;
export const { useDownloadFileMutation } = dashBoardApi;
export const { useDeleteFileMutation } = dashBoardApi;
