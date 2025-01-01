import * as yup from 'yup'

export const addRoleSchema = yup.object().shape({
  name: yup.string().max(30, 'Tên vai trò không được quá 30 ký tự').required('Tên vai trò không được để trống'),
  permissionID: yup.array().required('Quyền hạn không được để trống')
})

export const updateRoleSchema = yup.object().shape({
  name: yup.string().max(30, 'Tên vai trò không được quá 30 ký tự').required('Tên vai trò không được để trống'),
  permissionID: yup.array().required('Quyền hạn không được để trống')
})
