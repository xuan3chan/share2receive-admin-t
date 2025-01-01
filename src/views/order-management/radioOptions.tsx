// ** MUI Imports
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import MuiRadio, { RadioProps } from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useRouter } from 'next/router'

const Radio = (props: RadioProps) => {
  return (
    <MuiRadio
      {...props}
      disableRipple={true}
      sx={{ '& svg': { height: 18, width: 18 } }}
      checkedIcon={
        <svg width='24' height='24' viewBox='0 0 24 24'>
          <path fill='currentColor' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' />
        </svg>
      }
      icon={
        <svg width='24' height='24' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
          />
        </svg>
      }
    />
  )
}

const pathname = '/order-management'

const RadioOptions = () => {
  const router = useRouter()
  const searchParams = router.query

  const filterValue = searchParams.filterValue?.toString() || 'pending'

  const handleFilter = (e: { target: { value: any } }) => {
    const newFilter = e.target.value
    router.push({
      pathname: pathname,
      query: {
        ...searchParams, // giữ các giá trị searchParams hiện tại
        filterBy: 'requestRefund.status',
        filterValue: newFilter
      }
    })
  }

  return (
    <FormControl>
      <FormLabel component='legend'>Danh sách xem theo trạng thái</FormLabel>
      <RadioGroup row defaultValue={filterValue} aria-label='gender' name='customized-radios' onChange={handleFilter}>
        <FormControlLabel value='pending' control={<Radio />} label='Chờ xử lý' />
        <FormControlLabel value='approved' control={<Radio />} label='Đang xử lý' />
        <FormControlLabel value='refunded' control={<Radio />} label='Đã hoàn tiền' />
        <FormControlLabel value='rejected' control={<Radio />} label='Đã từ chối' />
      </RadioGroup>
    </FormControl>
  )
}

export default RadioOptions
