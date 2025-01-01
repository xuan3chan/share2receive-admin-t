import * as yup from 'yup'

// Regex cho phép chữ cái, số, dấu cách và tiếng Việt
const vietnameseNameRegex =
  /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/

export const addAdminSchema = yup.object().shape({
  adminName: yup
    .string()
    .max(50, 'Tên quản trị viên không dài quá 50 ký tự')
    .required('Tên quản trị viên không được để trống'),
  accountName: yup
    .string()
    .max(20, 'Tên tài khoản không dài quá 20 ký tự')
    .matches(/^[a-zA-Z0-9]+$/, 'Tên tài khoản chỉ được chứa chữ cái và số')
    .required('Tài khoản không được để trống'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu không được để trống'),
  roleId: yup.string().required('Vai trò không được để trống')
})

export const updateAdminSchema = yup.object().shape({
  adminName: yup
    .string()
    .matches(vietnameseNameRegex, 'Tên quản trị viên không được chứa ký tự đặc biệt')
    .max(50, 'Tên quản trị viên không dài quá 50 ký tự')
    .required('Tên quản trị viên không được để trống'),
  accountName: yup
    .string()
    .max(20, 'Tên tài khoản không dài quá 20 ký tự')
    .matches(/^[a-zA-Z0-9]+$/, 'Tên tài khoản chỉ được chứa chữ cái và số')
    .required('Tài khoản không được để trống'),

  // Điều kiện validation cho password
  password: yup.string().when('showUpdatePassword', {
    is: true, // Chỉ validate khi showUpdatePassword là true
    then: schema => schema.min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
    otherwise: schema => schema.notRequired() // Không yêu cầu nếu không cập nhật mật khẩu
  }),
  confirmPassword: yup.string().when('showUpdatePassword', {
    is: true, // Chỉ validate khi showUpdatePassword là true
    then: schema =>
      schema
        .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
        .required('Xác nhận mật khẩu không được để trống'),
    otherwise: schema => schema.notRequired() // Không yêu cầu nếu không cập nhật mật khẩu
  }),
  roleId: yup.string().required('Vai trò không được để trống')
})
