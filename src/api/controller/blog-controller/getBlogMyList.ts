import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListBlogVo, type DeepRequired } from "../../interface";

/**
 * /blog/my/list
 */
export function getBlogMyList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListBlogVo>>(`/blog/my/list`, config);
}
