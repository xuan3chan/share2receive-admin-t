import Add from 'src/views/evidence/add'
import RefundPage from 'src/views/evidence/indexPage'
import ShareFile from 'src/views/evidence/shareFile'
import Update from 'src/views/evidence/update'

export default function RefundManagement() {
  return (
    <>
      <RefundPage filterValue='refundPeriod' pathname='/refund-management' bigTitle='Danh sách đối soát hoàn tiền' />
      <Add type='refundPeriod' filterValue='refundPeriod' />
      <Update filterValue='refundPeriod' />
      <ShareFile />
    </>
  )
}
