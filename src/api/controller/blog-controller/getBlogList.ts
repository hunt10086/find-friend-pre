import request, { type AxiosRequestConfig } from "axios";
import { type BaseResponseListBlogVo, type DeepRequired } from "../../interface";

/**
 * /blog/list
 */
export function getBlogList(config?: AxiosRequestConfig) {
    return request.get<DeepRequired<BaseResponseListBlogVo>>(`/blog/list`, config);
}
