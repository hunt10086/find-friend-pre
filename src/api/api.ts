/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** @format int64 */
  id?: number;
  userName?: string;
  userAccount?: string;
  avatarUrl?: string;
  /** @format int32 */
  gender?: number;
  tags?: string;
  userPassword?: string;
  phone?: string;
  email?: string;
  /** @format int32 */
  userStatus?: number;
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  /** @format int32 */
  isDelete?: number;
  /** @format int32 */
  userRole?: number;
  profile?: string;
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
}

export interface BaseResponseBoolean {
  /** @format int32 */
  code?: number;
  data?: boolean;
  message?: string;
  description?: string;
}

export interface UserRegisterRequest {
  userAccount?: string;
  userPassword?: string;
  checkPassword?: string;
  email?: string;
  code?: string;
}

export interface BaseResponseLong {
  /** @format int32 */
  code?: number;
  /** @format int64 */
  data?: number;
  message?: string;
  description?: string;
}

export interface UserLoginRequest {
  userAccount?: string;
  userPassword?: string;
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
}

export interface BaseResponseUser {
  /** @format int32 */
  code?: number;
  data?: User;
  message?: string;
  description?: string;
}

export interface BaseResponseString {
  /** @format int32 */
  code?: number;
  data?: string;
  message?: string;
  description?: string;
}

export interface TeamDTO {
  /** @format int64 */
  id?: number;
  teamName?: string;
  description?: string;
  /** @format int32 */
  maxNum?: number;
  /** @format int64 */
  userId?: number;
  /** @format int32 */
  status?: number;
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  password?: string;
  icon?: string;
  /** @format int64 */
  nowNum?: number;
}

export interface CreateTeamRequest {
  teamName?: string;
  description?: string;
  /** @format int32 */
  maxNum?: number;
  /** @format int64 */
  userId?: number;
  /** @format int32 */
  status?: number;
  password?: string;
  icon?: string;
}

export interface FriendRequests {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  fromUserId?: number;
  /** @format int64 */
  toUserId?: number;
  message?: string;
  /** @format int32 */
  status?: number;
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
}

export interface FriendRequestsRequest {
  /** @format int64 */
  friendUserId?: number;
  message?: string;
}

export interface BlogRequest {
  title?: string;
  passage?: string;
  kind?: string;
  /** @format int32 */
  status?: number;
  /** @format int64 */
  id?: number;
}

export interface TeamChatMessageRequest {
  /** @format int64 */
  teamId?: number;
  content?: string;
}

export interface BaseResponseListUser {
  /** @format int32 */
  code?: number;
  data?: User[];
  message?: string;
  description?: string;
}

export interface BaseResponseIPageUser {
  /** @format int32 */
  code?: number;
  data?: IPageUser;
  message?: string;
  description?: string;
}

export interface IPageUser {
  /** @format int64 */
  size?: number;
  records?: User[];
  /** @format int64 */
  total?: number;
  /** @format int64 */
  current?: number;
  /**
   * @deprecated
   * @format int64
   */
  pages?: number;
}

export interface BaseResponseListUserVO {
  /** @format int32 */
  code?: number;
  data?: UserVO[];
  message?: string;
  description?: string;
}

export interface UserVO {
  /** @format int64 */
  id?: number;
  userName?: string;
  avatarUrl?: string;
  tags?: string;
  profile?: string;
  /** @format double */
  distance?: number;
}

export interface BaseResponseListTeamDTO {
  /** @format int32 */
  code?: number;
  data?: TeamDTO[];
  message?: string;
  description?: string;
}

export interface BaseResponseUserVO {
  /** @format int32 */
  code?: number;
  data?: UserVO;
  message?: string;
  description?: string;
}

export interface BaseResponseListFriendRequests {
  /** @format int32 */
  code?: number;
  data?: FriendRequests[];
  message?: string;
  description?: string;
}

export interface BaseResponseInteger {
  /** @format int32 */
  code?: number;
  /** @format int32 */
  data?: number;
  message?: string;
  description?: string;
}

export interface BaseResponseListFriendMessages {
  /** @format int32 */
  code?: number;
  data?: FriendMessages[];
  message?: string;
  description?: string;
}

export interface FriendMessages {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  senderId?: number;
  /** @format int64 */
  receiverId?: number;
  messageContent?: string;
  /** @format date-time */
  sendTime?: string;
  /** @format int32 */
  status?: number;
}

export interface BaseResponseListCommentVO {
  /** @format int32 */
  code?: number;
  data?: CommentVO[];
  message?: string;
  description?: string;
}

export interface CommentVO {
  /** @format date-time */
  createTime?: string;
  content?: string;
  avatarUrl?: string;
  userName?: string;
}

export interface BaseResponseUserComment {
  /** @format int32 */
  code?: number;
  data?: UserComment;
  message?: string;
  description?: string;
}

export interface UserComment {
  /** @format int64 */
  userId?: number;
  /** @format int64 */
  blogId?: number;
  /** @format date-time */
  createTime?: string;
  /** @format int32 */
  isDelete?: number;
  content?: string;
}

export interface BaseResponseIPageBlogVO {
  /** @format int32 */
  code?: number;
  data?: IPageBlogVO;
  message?: string;
  description?: string;
}

export interface BlogVO {
  /** @format int64 */
  id?: number;
  title?: string;
  passage?: string;
  /** @format int64 */
  userId?: number;
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  kind?: string;
  /** @format int32 */
  status?: number;
  /** @format int32 */
  praise?: number;
  avatarUrl?: string;
}

export interface IPageBlogVO {
  /** @format int64 */
  size?: number;
  records?: BlogVO[];
  /** @format int64 */
  total?: number;
  /** @format int64 */
  current?: number;
  /**
   * @deprecated
   * @format int64
   */
  pages?: number;
}

export interface BaseResponseBlog {
  /** @format int32 */
  code?: number;
  data?: Blog;
  message?: string;
  description?: string;
}

export interface Blog {
  /** @format int64 */
  id?: number;
  title?: string;
  passage?: string;
  /** @format int64 */
  userId?: number;
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  /** @format int32 */
  isDelete?: number;
  /** @format int32 */
  status?: number;
  kind?: string;
  /** @format int32 */
  praise?: number;
}

export interface BaseResponseListTeamChatMessageVO {
  /** @format int32 */
  code?: number;
  data?: TeamChatMessageVO[];
  message?: string;
  description?: string;
}

export interface TeamChatMessageVO {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  teamId?: number;
  /** @format int64 */
  userId?: number;
  userName?: string;
  content?: string;
  /** @format date-time */
  createTime?: string;
  avatarUrl?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:7777/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl http://localhost:7777/api
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  user = {
    /**
     * No description
     *
     * @tags user-controller
     * @name UserUpdate
     * @summary 用户更新
     * @request POST:/user/update
     */
    userUpdate: (data: User, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/user/update`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name UserRegister
     * @summary 注册请求
     * @request POST:/user/register
     */
    userRegister: (data: UserRegisterRequest, params: RequestParams = {}) =>
      this.request<BaseResponseLong, any>({
        path: `/user/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name UserLogout
     * @summary 用户注销
     * @request POST:/user/logout
     */
    userLogout: (params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/user/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name UserLogin
     * @summary 登录请求
     * @request POST:/user/login
     */
    userLogin: (data: UserLoginRequest, params: RequestParams = {}) =>
      this.request<BaseResponseUser, any>({
        path: `/user/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name UserDelete
     * @summary 删除用户
     * @request POST:/user/delete
     */
    userDelete: (data: number, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/user/delete`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name SendCode
     * @summary 发送验证码
     * @request GET:/user/sendCode
     */
    sendCode: (
      query: {
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseLong, any>({
        path: `/user/sendCode`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name GetUser
     * @summary 查询所有用户
     * @request GET:/user/search
     */
    getUser: (
      query: {
        username: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListUser, any>({
        path: `/user/search`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name UpdateMassage
     * @summary 查询单个用户
     * @request GET:/user/searchOne
     */
    updateMassage: (params: RequestParams = {}) =>
      this.request<BaseResponseListUser, any>({
        path: `/user/searchOne`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name SearchUsersByTagsWithPagination
     * @summary 根据标签分页查询用户
     * @request GET:/user/search/tags/page
     */
    searchUsersByTagsWithPagination: (
      query?: {
        tagsList?: string[];
        /**
         * @format int64
         * @default 1
         */
        currentPage?: number;
        /**
         * @format int64
         * @default 15
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseIPageUser, any>({
        path: `/user/search/tags/page`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name SearchUserById
     * @summary 根据id查询
     * @request GET:/user/search/one
     */
    searchUserById: (
      query: {
        /** @format int64 */
        id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseUser, any>({
        path: `/user/search/one`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name NearUser
     * @summary 附近用户
     * @request GET:/user/nearUser
     */
    nearUser: (params: RequestParams = {}) =>
      this.request<BaseResponseListUserVO, any>({
        path: `/user/nearUser`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name UserListLike
     * @summary 主页用户推荐
     * @request GET:/user/listLike
     */
    userListLike: (
      query: {
        /** @format int32 */
        count: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListUser, any>({
        path: `/user/listLike`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name GetCurrentUser
     * @summary 展示当前用户信息
     * @request GET:/user/current
     */
    getCurrentUser: (params: RequestParams = {}) =>
      this.request<BaseResponseUser, any>({
        path: `/user/current`,
        method: "GET",
        ...params,
      }),
  };
  upload = {
    /**
     * @description 上传图片文件到指定空间
     *
     * @tags upload-controller
     * @name UploadPicture
     * @summary 上传图片
     * @request POST:/upload
     */
    uploadPicture: (
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseString, any>({
        path: `/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
  team = {
    /**
     * No description
     *
     * @tags team-controller
     * @name UpdateTeam
     * @summary 更新队伍
     * @request POST:/team/update
     */
    updateTeam: (
      query: {
        /** @format int64 */
        id: number;
      },
      data: TeamDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/team/update`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name QuitTeam
     * @summary 退出队伍
     * @request POST:/team/quit
     */
    quitTeam: (data: TeamDTO, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/team/quit`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name JoinTeam
     * @summary 加入队伍
     * @request POST:/team/join
     */
    joinTeam: (
      query: {
        password: string;
      },
      data: TeamDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/team/join`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name DeleteTeam
     * @summary 删除队伍
     * @request POST:/team/delete
     */
    deleteTeam: (data: TeamDTO, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/team/delete`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name AddTeam
     * @summary 创建队伍
     * @request POST:/team/create
     */
    addTeam: (data: CreateTeamRequest, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/team/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name SearchTeam
     * @summary 根据队伍名搜索队伍
     * @request GET:/team/search
     */
    searchTeam: (
      query: {
        teamName: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListTeamDTO, any>({
        path: `/team/search`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name SearchTeamById
     * @summary 根据id查找队伍
     * @request GET:/team/searchByID
     */
    searchTeamById: (
      query: {
        /** @format int64 */
        teamId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseLong, any>({
        path: `/team/searchByID`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name GetMyTeam
     * @summary 展示创建的队伍列表
     * @request GET:/team/myTeam
     */
    getMyTeam: (params: RequestParams = {}) =>
      this.request<BaseResponseListTeamDTO, any>({
        path: `/team/myTeam`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name ListTeam
     * @summary 获取队伍列表
     * @request GET:/team/list
     */
    listTeam: (params: RequestParams = {}) =>
      this.request<BaseResponseListTeamDTO, any>({
        path: `/team/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name GetJoinTeam
     * @summary 展示加入队伍列表
     * @request GET:/team/joinTeam
     */
    getJoinTeam: (params: RequestParams = {}) =>
      this.request<BaseResponseListTeamDTO, any>({
        path: `/team/joinTeam`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-controller
     * @name GetTeam
     * @summary 获取队伍信息
     * @request GET:/team/get/team
     */
    getTeam: (params: RequestParams = {}) =>
      this.request<BaseResponseListTeamDTO, any>({
        path: `/team/get/team`,
        method: "GET",
        ...params,
      }),
  };
  friends = {
    /**
     * No description
     *
     * @tags friends-controller
     * @name DisAgreeFriendRequest
     * @summary 拒绝好友申请
     * @request POST:/friends/disagree
     */
    disAgreeFriendRequest: (data: FriendRequests, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/friends/disagree`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends-controller
     * @name DeleteFriend
     * @summary 删除好友
     * @request POST:/friends/delete
     */
    deleteFriend: (data: number, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/friends/delete`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends-controller
     * @name AgreeFriendRequest
     * @summary 同意好友申请
     * @request POST:/friends/agree
     */
    agreeFriendRequest: (data: FriendRequests, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/friends/agree`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends-controller
     * @name GetFriendList
     * @summary 获取好友列表
     * @request GET:/friends/list
     */
    getFriendList: (params: RequestParams = {}) =>
      this.request<BaseResponseListUserVO, any>({
        path: `/friends/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags friends-controller
     * @name CheckFriend
     * @summary 检查是否为好友
     * @request GET:/friends/check
     */
    checkFriend: (
      query: {
        /** @format int64 */
        friendUserId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseUserVO, any>({
        path: `/friends/check`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  friendRequests = {
    /**
     * No description
     *
     * @tags friend-requests-controller
     * @name SendFriendRequest
     * @summary 发送好友申请
     * @request POST:/friendRequests/send
     */
    sendFriendRequest: (
      data: FriendRequestsRequest,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/friendRequests/send`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friend-requests-controller
     * @name GetFriendRequests
     * @summary 获取好友申请列表
     * @request GET:/friendRequests/list
     */
    getFriendRequests: (params: RequestParams = {}) =>
      this.request<BaseResponseListFriendRequests, any>({
        path: `/friendRequests/list`,
        method: "GET",
        ...params,
      }),
  };
  friendMessage = {
    /**
     * No description
     *
     * @tags friend-message-controller
     * @name MarkMessagesAsRead
     * @summary 标记消息为已读
     * @request POST:/friendMessage/markAsRead
     */
    markMessagesAsRead: (
      query: {
        /** @format int64 */
        friendId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/friendMessage/markAsRead`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags friend-message-controller
     * @name GetUnreadMessageCount
     * @summary 获取未读消息数量
     * @request GET:/friendMessage/unreadCount
     */
    getUnreadMessageCount: (params: RequestParams = {}) =>
      this.request<BaseResponseInteger, any>({
        path: `/friendMessage/unreadCount`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags friend-message-controller
     * @name GetFriendMessages
     * @summary 获取与指定好友的聊天记录
     * @request GET:/friendMessage/list
     */
    getFriendMessages: (
      query: {
        /** @format int64 */
        friendId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListFriendMessages, any>({
        path: `/friendMessage/list`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  blog = {
    /**
     * No description
     *
     * @tags blog-controller
     * @name UpdateBlog
     * @summary 更新博客
     * @request POST:/blog/update
     */
    updateBlog: (
      query: {
        /** @format int64 */
        id: number;
      },
      data: BlogRequest,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseString, any>({
        path: `/blog/update`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name CreateBlog
     * @summary 创建博客
     * @request POST:/blog/create
     */
    createBlog: (data: BlogRequest, params: RequestParams = {}) =>
      this.request<BaseResponseString, any>({
        path: `/blog/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name GetMyBlogList
     * @summary 获取我的博客列表
     * @request GET:/blog/my/list
     */
    getMyBlogList: (
      query: {
        /** @format int64 */
        currentPage: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseIPageBlogVO, any>({
        path: `/blog/my/list`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name GetBlogList
     * @summary 获取博客列表
     * @request GET:/blog/list
     */
    getBlogList: (
      query: {
        /** @format int64 */
        currentPage: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseIPageBlogVO, any>({
        path: `/blog/list`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name GetBlogLike
     * @summary 点赞博客
     * @request GET:/blog/like
     */
    getBlogLike: (
      query: {
        /** @format int64 */
        blogId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/blog/like`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name GetBlogIsLike
     * @summary 判断博客是否点赞
     * @request GET:/blog/isLike
     */
    getBlogIsLike: (
      query: {
        /** @format int64 */
        blogId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/blog/isLike`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name GetBlog
     * @summary 获取单个博客
     * @request GET:/blog/getOne
     */
    getBlog: (
      query: {
        /** @format int64 */
        blogId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBlog, any>({
        path: `/blog/getOne`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blog-controller
     * @name DeleteBlog
     * @summary 删除博客
     * @request GET:/blog/delete
     */
    deleteBlog: (
      query: {
        /** @format int64 */
        id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseBoolean, any>({
        path: `/blog/delete`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  api = {
    /**
     * No description
     *
     * @tags team-chat-message-controller
     * @name SendMessage
     * @summary 发送队伍聊天消息
     * @request POST:/api/teamChat/send
     */
    sendMessage: (data: TeamChatMessageRequest, params: RequestParams = {}) =>
      this.request<BaseResponseBoolean, any>({
        path: `/api/teamChat/send`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags team-chat-message-controller
     * @name GetMessageList
     * @summary 获取队伍消息列表
     * @request GET:/api/teamChat/list
     */
    getMessageList: (
      query: {
        /** @format int64 */
        teamId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListTeamChatMessageVO, any>({
        path: `/api/teamChat/list`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  teamUser = {
    /**
     * No description
     *
     * @tags user-team-controller
     * @name List
     * @summary 获取队伍成员列表
     * @request GET:/teamUser/list
     */
    list: (
      query: {
        /** @format int64 */
        teamId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListUser, any>({
        path: `/teamUser/list`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  comment = {
    /**
     * No description
     *
     * @tags comment-controller
     * @name List
     * @summary 获取评论列表
     * @request GET:/comment/list
     */
    list: (
      query: {
        /** @format int64 */
        blogId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseListCommentVO, any>({
        path: `/comment/list`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags comment-controller
     * @name Create
     * @summary 创建评论
     * @request GET:/comment/create
     */
    create: (
      query: {
        comment: string;
        /** @format int64 */
        blogId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseUserComment, any>({
        path: `/comment/create`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
