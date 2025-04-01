'use client'

import Link from 'next/link'
import React from 'react'

function Logo() {
  return (
    <Link
      href="/"
      className="font-bold text-3xl bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text hover:cursor-pointer"
    >
      ChiForm
    </Link>
  )
}

export default Logo
