import service from './request'

// 获取所有学生空间情况 API
export const getAllStudentsSpaceAPI = (
  pageNum: number,
  pageSize: number,
  studentAccount: string,
  studentName: string,
) => {
  return service
    .get('/manager/get_students_space', {
      params: {
        pageNum, // 分页参数
        pageSize, // 每页显示条数
        studentAccount,
        studentName,
      },
    })
    .then((response) => response.data.data)
}

// 查看学生文件 API
export const viewStudentFilesAPI = (
  studentId: string,
  pageNum: number,
  pageSize: number,
  fileName: string,
  dateStart: number,
  dateEnd: number,
) => {
  return service
    .get('/manager/view_files', {
      params: {
        studentId, // 学生ID为必需参数
        pageNum,
        pageSize,
        fileName,
        dateStart,
        dateEnd,
      },
    })
    .then((response) => response.data.data)
}

// 删除学生文件 API
export const deleteStudentFilesAPI = (studentId: string, uploadId: string) => {
  return service
    .delete('/manager/delete_files', {
      data: {
        studentId, // 学生ID为必需参数
        upload_id: uploadId, // 上传文件的ID为必需参数
      },
    })
    .then((response) => response.data.data)
}
