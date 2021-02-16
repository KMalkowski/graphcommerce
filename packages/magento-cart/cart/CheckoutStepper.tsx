import { makeStyles, Theme } from '@material-ui/core'
import responsiveVal from '@reachdigital/next-ui/Styles/responsiveVal'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      maxWidth: '60%',
      margin: `${theme.spacings.sm} auto ${theme.spacings.md} auto`,
      [theme.breakpoints.down('xs')]: {
        maxWidth: '75%',
      },
    },
    step: {
      height: responsiveVal(2, 4),
      background: theme.palette.divider,
      flex: 1,
      marginRight: responsiveVal(6, 10),
      marginLeft: responsiveVal(6, 10),
    },
    current: {
      background: theme.palette.secondary.main,
    },
  }),
  { name: 'CheckoutStepper' },
)

type CheckoutStepperProps = {
  steps: number
  currentStep: number
}

export default function CheckoutStepper(props: CheckoutStepperProps) {
  const { steps, currentStep } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {[...Array(steps).keys()].map((step: number) => (
        <div
          className={clsx(classes.step, { [classes.current]: currentStep - 1 >= step })}
          key={step}
        />
      ))}
    </div>
  )
}