import Add from 'src/views/evidence/add'
import PaymentPage from 'src/views/evidence/indexPage'
import ShareFile from 'src/views/evidence/shareFile'
import Update from 'src/views/evidence/update'

export default function PaymentManagement() {
  return (
    <>
      <PaymentPage
        filterValue='paymentPeriod'
        pathname='/payment-management'
        bigTitle='Danh sách đối soát thanh toán'
      />
      <Add type='paymentPeriod' filterValue='paymentPeriod' />
      <Update filterValue='paymentPeriod' />
      <ShareFile />
    </>
  )
}
