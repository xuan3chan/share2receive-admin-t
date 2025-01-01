import { useRouter } from 'next/router'
import { SyntheticEvent, useState } from 'react'
import useSWR from 'swr'
import { ApproveModal } from 'src/views/product-management/approveModal'
import { AlertDelete } from 'src/views/components/alert'
import { useStateUX } from 'src/zustand/stateUX'
import toast from 'react-hot-toast'
import reportService from 'src/services/report/report.service'
import { useReportStore } from 'src/zustand/report'
import { ReportOrder, ReportProduct } from 'src/types/report/reportTypes'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import TabOrder from 'src/views/report-management/tabOrder'
import TabProduct from 'src/views/report-management/tabProduct'
import userService from 'src/services/users/users.service'
import productService from 'src/services/product/product.service'

const pathname = '/report-management'

const ReportManagementPage = () => {
  const {
    setReportOrder,
    reportOrder,
    setListReportOrder,
    listReportOrder,
    setReport,
    report,
    setReport2,
    report2,
    setOpenBlockUser,
    openBlockUser,
    setOpenUnblockUser,
    setOpenUnblockUserProduct,
    openUnblockUser,
    openUnblockUserProduct,
    setReportProduct,
    reportProduct,
    setOpenWarningUser,
    openWarningUser,
    setOpenBlockUserProduct,
    openBlockUserProduct,
    setOpenBlockProduct,
    openBlockProduct,
    setOpenUnblockProduct,
    openUnblockProduct
  } = useReportStore()

  const { setLoading, loading } = useStateUX()
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const router = useRouter()

  const searchParams = router.query
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const sortBy = searchParams.sortBy?.toString() || ''
  const sortOrder = searchParams.sortOrder?.toString() || ''

  const { mutate: mutateOrder } = useSWR(
    ['/api/report', page, limit, sortBy, sortOrder, 'order'],
    () => reportService.getReport(page, limit, sortBy, sortOrder, 'order'),
    {
      onSuccess: data => {
        setReportOrder(data?.data)
        setListReportOrder(data)
      }
    }
  )

  const { mutate: mutateProduct } = useSWR(
    ['/api/report', page, limit, sortBy, sortOrder, 'product'],
    () => reportService.getReportProduct(page, limit, sortBy, sortOrder, 'product'),
    {
      onSuccess: data => {
        setReportProduct(data?.data)
      }
    }
  )

  const pageCount = Math.ceil((listReportOrder?.totalReports || 0) / limit)

  const handlePageChange = (e: any, value: any) => {
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        page: value,
        limit: limit // giữ nguyên giá trị pageLimit
      }
    })
  }

  const handlePageLimitChange = (e: { target: { value: any } }) => {
    const newLimit = e.target.value
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        limit: newLimit,
        page: 1 // reset về page 1 khi thay đổi pageLimit
      }
    })
  }

  // Styled TabList component
  const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
    borderBottom: '0 !important',
    '&, & .MuiTabs-scroller': {
      boxSizing: 'content-box',
      padding: theme.spacing(1.25, 1.25, 2),
      margin: `${theme.spacing(-1.25)} !important`
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    },
    '& .Mui-selected': {
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
      lineHeight: 1,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  }))

  const onWarningUser = async (_id: string) => {
    setLoading(true)
    await reportService.warningUser(
      _id,
      () => {
        toast.success('Cảnh cáo người dùng thành công')
        setOpenWarningUser(false)
        mutateOrder()
        setLoading(false)
        setReport({} as ReportOrder)
      },
      () => {
        toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')
        setLoading(false)
      }
    )
  }

  const onBlockUser = async (_id: string) => {
    setLoading(true)
    await reportService.blockUser(
      _id,
      () => {
        toast.success('Khóa người dùng thành công')
        setOpenBlockUser(false)
        setOpenBlockUserProduct(false)
        mutateOrder()
        mutateProduct()
        setLoading(false)
        setReport({} as ReportOrder)
        setReport2({} as ReportProduct)
      },
      () => {
        toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')
        setLoading(false)
      }
    )
  }

  const onUnblockUser = async (_id: string) => {
    setLoading(true)
    await userService
      .block(_id, false)
      .then(() => {
        toast.success('Mở khóa người dùng thành công')
        setOpenUnblockUser(false)
        setOpenUnblockUserProduct(false)
        mutateOrder()
        mutateProduct()
        setLoading(false)
        setReport({} as ReportOrder)
        setReport2({} as ReportProduct)
      })
      .catch(() => {
        toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')
        setLoading(false)
      })
  }

  const onBlockProduct = async (_id: string) => {
    setLoading(true)
    await reportService.blockProduct(
      _id,
      () => {
        toast.success('Khóa sản phẩm thành công')
        setOpenBlockProduct(false)
        mutateProduct()
        setLoading(false)
        setReport2({} as ReportProduct)
      },
      () => {
        toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')
        setLoading(false)
      }
    )
  }

  const onUnblockProduct = async (_id: string) => {
    setLoading(true)
    await productService
      .block(_id, false)
      .then(() => {
        toast.success('Mở khóa sản phẩm thành công')
        setOpenUnblockProduct(false)
        mutateProduct()
        setLoading(false)
        setReport2({} as ReportProduct)
      })
      .catch(() => {
        toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')
        setLoading(false)
      })
  }

  const handleConfirmReport = async (id: string, isChecked: string) => {
    setLoading(true)
    await reportService.confirmReport(
      id,
      isChecked,
      () => {
        toast.success('Xác nhận báo cáo thành công')
        setLoading(false)
        mutateOrder()
        mutateProduct()
      },
      () => {
        toast.error('Đã có lỗi xảy ra vui lòng thử lại sau!')
        setLoading(false)
      }
    )
  }

  return (
    <>
      <TabContext value={value}>
        <TabList onChange={handleChange}>
          <Tab label='Đơn hàng' value='1' />
          <Tab label='Sản phẩm' value='2' />
        </TabList>
        <TabPanel value='1' sx={{ p: 0 }}>
          <TabOrder
            reportOrder={reportOrder || []}
            page={page}
            pageCount={pageCount}
            limit={limit}
            handlePageChange={handlePageChange}
            handlePageLimitChange={handlePageLimitChange}
            handleConfirmReport={handleConfirmReport}
          />
        </TabPanel>
        <TabPanel value='2' sx={{ p: 0 }}>
          <TabProduct
            reportProduct={reportProduct || []}
            page={page}
            pageCount={pageCount}
            limit={limit}
            handlePageChange={handlePageChange}
            handlePageLimitChange={handlePageLimitChange}
            handleConfirmReport={handleConfirmReport}
          />
        </TabPanel>
      </TabContext>
      <ApproveModal />
      <AlertDelete
        title='Cảnh cáo người dùng này'
        content=''
        loading={loading}
        onClose={() => {
          setOpenWarningUser(false)
        }}
        open={openWarningUser}
        submitText='Cảnh cáo'
        onSubmit={async () => {
          onWarningUser(report?._id)
        }}
      />
      <AlertDelete
        title='Xác nhận khóa người dùng'
        content='Bạn có chắc chắn muốn khóa người dùng này không?'
        loading={loading}
        onClose={() => {
          setOpenBlockUser(false)
        }}
        open={openBlockUser}
        submitText='Khóa'
        onSubmit={async () => {
          onBlockUser(report?._id)
        }}
      />
      <AlertDelete
        title='Xác nhận khóa chủ sản phẩm'
        content='Bạn có chắc chắn muốn khóa chủ sản phẩm này không?'
        loading={loading}
        onClose={() => {
          setOpenBlockUserProduct(false)
        }}
        open={openBlockUserProduct}
        submitText='Khóa'
        onSubmit={async () => {
          onBlockUser(report2?._id)
        }}
      />
      <AlertDelete
        title='Xác nhận mở khóa người dùng'
        content='Bạn có chắc chắn muốn mở khóa người dùng này không?'
        loading={loading}
        onClose={() => {
          setOpenUnblockUser(false)
        }}
        open={openUnblockUser}
        submitText='Mở khóa'
        onSubmit={async () => {
          onUnblockUser(report?.target.sellerId._id)
        }}
      />
      <AlertDelete
        title='Xác nhận mở khóa chủ sản phẩm'
        content='Bạn có chắc chắn muốn mở khóa chủ sản phẩm này không?'
        loading={loading}
        onClose={() => {
          setOpenUnblockUserProduct(false)
        }}
        open={openUnblockUserProduct}
        submitText='Mở khóa'
        onSubmit={async () => {
          onUnblockUser(report2?.target.userId._id)
        }}
      />

      <AlertDelete
        title='Xác nhận khóa sản phẩm'
        content='Bạn có chắc chắn muốn khóa sản phẩm này không?'
        loading={loading}
        onClose={() => {
          setOpenBlockProduct(false)
        }}
        open={openBlockProduct}
        submitText='Khóa'
        onSubmit={async () => {
          onBlockProduct(report2?._id)
        }}
      />

      <AlertDelete
        title='Xác nhận mở khóa sản phẩm'
        content='Bạn có chắc chắn muốn mở khóa sản phẩm này không?'
        loading={loading}
        onClose={() => {
          setOpenUnblockProduct(false)
        }}
        open={openUnblockProduct}
        submitText='Mở khóa'
        onSubmit={async () => {
          onUnblockProduct(report2?._id)
        }}
      />
    </>
  )
}
ReportManagementPage.acl = {
  action: 'read',
  subject: 'product'
}
export default ReportManagementPage
