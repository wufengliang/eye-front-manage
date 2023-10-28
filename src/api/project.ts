/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-13 11:34:55
 * @LastEditTime: 2023-10-28 20:55:11
 * @Description:
 */
import instance from './instance';

/**
 * @desc 获取项目列表
 */
export function getProjectList(data: unknown) {
  return instance.post(`/api/survey/get?status=1`, data);
}

/**
 * @desc 获取已回收的项目 status=2
 */
export function getRecoveryList(data: unknown, status = 2) {
  return instance.post(`/api/survey/get?status=${status}`, data);
}

/**
 * @desc 创建项目
 */
export function createProjectData(data: unknown) {
  return instance.put(`/api/survey/add`, data);
}

/**
 * @desc 更新项目 1是上线 2是下线
 */
export function updateProjectData(data: unknown) {
  return instance.post(`/api/survey/update`, data);
}


/**
 * @desc 获取人脸示范管理数据
 */
export function getShowFaceList() {
  return instance.get(`/api/file/system/getFile?fileSystemId=8`)
}

/**
 * @desc 删除人脸示范数据
 */
export function deleteFaceItem(fileId: string | number) {
  return instance.delete(`/api/file/delete?fileId=${fileId}`)
}

/**
 * @desc 获取问卷信息
 */
export function getSurveyData(id: string) {
  return instance.get(`/api/question/get?surveyId=${id}`);
}

/**
 * @desc 复制问卷
 */
export function copySurvey(surveyId: string, userId: string) {
  return instance.get(`/api/survey/copy?surveyId=${surveyId}&userId=${userId}`);
}

/**
 * @desc 删除问题
 */
export function deleteQuestion(id: number | string) {
  return instance.delete(`/api/question/delete`, { data: { id: Number(`${id}`) } })
}

/**
 * @desc 添加问题
 */
export function addQuestion(data: unknown) {
  return instance.put(`/api/question/add`, { ...(data || {}) })
}


/**
 * @desc 更新问题
 */
export function updateQuestion(data: unknown) {
  return instance.post(`/api/question/update/question`, data);
}


/**
 * @desc 获取背景问题信息
 */
export function getProfileData(surveyId: number) {
  return instance.get(`/api/question/profile/get`, { params: { surveyId } })
}

/**
 * @desc 删除背景问题信息
 */
export function deleteProfileData(id: number) {
  return instance.delete(`/api/question/profile/delete`, { params: { id } })
}

/**
 * @desc 更新背景问题信息
 */
export function updateProfileData(data: unknown) {
  return instance.post(`/api/question/profile/update`, data)
}

/**
 * @desc 新增背景问题信息
 */
export function addProfileData(data: unknown) {
  return instance.put(`/api/question/profile/add`, data);
}
