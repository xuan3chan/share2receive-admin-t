import * as yup from 'yup'

const vietnameseNameRegex =
  /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/

export const addBrandSchema = yup.object().shape({
  name: yup
    .string()
    .matches(vietnameseNameRegex, 'Tên thương hiệu không được chứa ký tự đặc biệt')
    .min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự')
    .max(50, 'Tên thương hiệu không dài quá 50 ký tự')
    .required('Tên thương hiệu không được để trống'),
  description: yup.string().max(1000, 'Mô tả không dài quá 1000 ký tự').optional(),
  priority: yup.string().required('Ưu tiên không được để trống'),
  status: yup.string().required('Trạng thái không được để trống')
})

export const updateBrandSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự')
    .max(50, 'Tên thương hiệu không dài quá 50 ký tự')
    .required('Tên thương hiệu không được để trống'),
  description: yup.string().max(1000, 'Mô tả không dài quá 1000 ký tự').default('').optional(),
  status: yup.string().required('Trạng thái không được để trống'),
  priority: yup.string().required('Ưu tiên không được để trống')
})
