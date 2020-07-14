import React from 'react'
import Link from 'next/link'
import CartLoader from 'components/Cart/Cart'
import clsx from 'clsx'
import logo from './magento-webshop-reach-digital.svg'
import HeaderMenu, { HeaderMenuProps } from './HeaderMenu'
import { useHeaderStyles } from './useHeaderStyles'

type HeaderProps = HeaderMenuProps & JSX.IntrinsicElements['header']

export default function Header(props: HeaderProps) {
  const { menu, urlResolver, ...headerProps } = props
  const classes = useHeaderStyles(props)

  return (
    <header {...headerProps} className={clsx(classes.navigation, headerProps.className)}>
      <Link href='/' passHref>
        <a className={classes.logo}>
          <img src={logo} alt='Logo' className={classes.logoImg} />
        </a>
      </Link>

      <div className={classes.menu}>
        <HeaderMenu menu={menu} urlResolver={urlResolver} />
      </div>

      <div className={classes.contact}>
        <CartLoader />
      </div>
    </header>
  )
}