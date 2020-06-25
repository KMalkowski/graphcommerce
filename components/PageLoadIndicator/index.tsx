import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LinearProgress, makeStyles, Fade } from '@material-ui/core'
import zIndex from '@material-ui/core/styles/zIndex'

const useStyles = makeStyles(
  {
    progress: {
      position: 'fixed',
      width: '100%',
      top: 0,
      height: 3,
      marginBottom: -3,
      zIndex: zIndex.tooltip,
    },
  },
  { name: 'PageLoadIndicator' },
)

const PageLoadIndicator: React.FC = () => {
  const router = useRouter()
  const classes = useStyles()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const show = () => setLoading(true)
    const hide = () => setLoading(false)
    router.events.on('routeChangeStart', show)
    router.events.on('routeChangeComplete', hide)
    router.events.on('routeChangeError', hide)

    return () => {
      router.events.off('routeChangeStart', show)
      router.events.off('routeChangeComplete', hide)
      router.events.off('routeChangeError', hide)
    }
  }, [router.events, router.pathname, router.query])

  return (
    <Fade in={loading}>
      <LinearProgress className={classes.progress} />
    </Fade>
  )
}

export default PageLoadIndicator