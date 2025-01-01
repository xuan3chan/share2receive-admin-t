import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import TableData from './TableData'
import { useEvidenceStore } from 'src/zustand/evidence'
import ReadFileXlsx from './readFileXlsx'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function IndexPage({
  filterValue,
  pathname,
  bigTitle
}: {
  filterValue: string
  pathname: string
  bigTitle: string
}) {
  const router = useRouter()
  const searchParams = router.query
  const file = searchParams.file?.toString() || ''

  const { title, setTitle, setDataExcel, toggleOpenAdd } = useEvidenceStore()

  useEffect(() => {
    if (!searchParams.file) {
      setTitle('')
      setDataExcel([])
    }
  }, [setDataExcel, setTitle, searchParams.file])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={<Typography variant='h3'>{bigTitle}</Typography>} />
          <CardContent>
            <Grid container justifyContent='flex-end'>
              <Button variant='contained' color='primary' onClick={toggleOpenAdd}>
                Thêm mới
              </Button>
            </Grid>
          </CardContent>
          {file ? (
            <ReadFileXlsx title={title} pathname={pathname} />
          ) : (
            <>
              <TableData filterValue={filterValue} pathname={pathname} />
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}
