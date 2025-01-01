import { Card, CardContent, Grid, Typography, Button, CardActions } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Image from 'next/image'
import { ConfigType } from 'src/types/config/configType'
import { KeyedMutator } from 'swr'
import { number, object } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import configService from 'src/services/config/config.service'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export default function PointTab({
  configData,
  mutate,
  isLoading
}: {
  configData: ConfigType | undefined
  mutate: KeyedMutator<ConfigType>
  isLoading: boolean
}) {
  const schema = object().shape({
    valueToPoint: number()
      .typeError('Giá trị phải là số')
      .min(1, 'phải nhập một số lớn hơn 1')
      .required('Giá trị quy đổi điểm không được để trống'),
    valueToPromotion: number()
      .typeError('Giá trị phải là số')
      .min(1, 'phải nhập một số lớn hơn 1')
      .required('Giá trị điểm điểm danh không được để trống'),
    valueToCross: number()
      .typeError('Giá trị phải là số')
      .min(1, 'phải nhập một số lớn hơn 1')
      .required('Giá trị điểm cho phép đăng không được để trống'),
    reportWarning: number()
      .typeError('Giá trị phải là số')
      .min(1, 'phải nhập một số lớn hơn 1')
      .required('Người dùng bị cảnh báo sau không được để trống'),
    reprotBlockerProduct: number()
      .typeError('Giá trị phải là số')
      .min(1, 'phải nhập một số lớn hơn 1')
      .required('Sản phẩm bị khóa sau không được để trống'),
    reportBlockUser: number()
      .typeError('Giá trị phải là số')
      .min(1, 'phải nhập một số lớn hơn 1')
      .required('Người dùng bị khóa sau không được để trống')
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      valueToPoint: configData?.valueToPoint,
      valueToPromotion: configData?.valueToPromotion,
      valueToCross: configData?.valueToCross,
      reportWarning: configData?.reportWarning,
      reprotBlockerProduct: configData?.reprotBlockerProduct,
      reportBlockUser: configData?.reportBlockUser
    },
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      valueToPoint: configData?.valueToPoint,
      valueToPromotion: configData?.valueToPromotion,
      valueToCross: configData?.valueToCross,
      reportWarning: configData?.reportWarning,
      reprotBlockerProduct: configData?.reprotBlockerProduct,
      reportBlockUser: configData?.reportBlockUser
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancel = () => {
    reset()
  }

  const onSubmit = async (data: any) => {
    if (!configData) return

    // Create an object with only changed values
    const changedValues = Object.keys(data).reduce((acc: any, key) => {
      if (data[key] !== configData[key as keyof ConfigType]) {
        acc[key] = data[key]
      }

      return acc
    }, {})

    // Only update if there are changes
    if (Object.keys(changedValues).length > 0) {
      await configService.updateConfig(
        configData._id,
        changedValues,
        () => {
          mutate()
          toast.success('Cập nhật cài đặt thành công', {
            position: 'top-center'
          })
        },
        () => {
          toast.error('Cập nhật cài đặt thất bại', {
            position: 'top-center'
          })
        }
      )
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={10}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <Typography variant='h6'>Giá trị quy đổi điểm</Typography>
                </Grid>
                <Grid item xs={9}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Controller
                      name='valueToPoint'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          error={Boolean(errors.valueToPoint)}
                          {...(errors.valueToPoint && { helperText: errors.valueToPoint.message })}
                        />
                      )}
                    />
                    <span>/ 1 điểm kim cương</span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '30px',
                        height: '30px'
                      }}
                    >
                      <Image
                        src='/latest.png'
                        alt='Kim cương'
                        width={100}
                        height={100}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </span>
                  </div>
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <Typography variant='h6'>Giá trị điểm điểm danh</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Controller
                    name='valueToPromotion'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        error={Boolean(errors.valueToPromotion)}
                        {...(errors.valueToPromotion && { helperText: errors.valueToPromotion.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <Typography variant='h6'>Giá trị điểm cho phép đăng</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Controller
                    name='valueToCross'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        error={Boolean(errors.valueToCross)}
                        {...(errors.valueToCross && { helperText: errors.valueToCross.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <Typography variant='h6'>Người dùng bị cảnh báo sau</Typography>
                </Grid>
                <Grid item xs={9}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Controller
                      name='reportWarning'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          error={Boolean(errors.reportWarning)}
                          {...(errors.reportWarning && { helperText: errors.reportWarning.message })}
                        />
                      )}
                    />
                    <span>lần xác nhận báo cáo</span>
                  </div>
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <Typography variant='h6'>Sản phẩm bị khóa sau</Typography>
                </Grid>
                <Grid item xs={9}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Controller
                      control={control}
                      name='reprotBlockerProduct'
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          error={Boolean(errors.reprotBlockerProduct)}
                          {...(errors.reprotBlockerProduct && {
                            helperText: errors.reprotBlockerProduct.message
                          })}
                        />
                      )}
                    />
                    <span>lần xác nhận báo cáo</span>
                  </div>
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <Typography variant='h6'>Người dùng bị khóa sau</Typography>
                </Grid>
                <Grid item xs={9}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Controller
                      control={control}
                      name='reportBlockUser'
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          error={Boolean(errors.reportBlockUser)}
                          {...(errors.reportBlockUser && { helperText: errors.reportBlockUser.message })}
                        />
                      )}
                    />
                    <span>lần xác nhận báo cáo</span>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant='outlined' onClick={handleCancel}>
              Đặt lại
            </Button>
            <Button type='submit' variant='contained' disabled={!isValid}>
              Lưu cài đặt
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  )
}
