import React, { useEffect } from 'react'
import Navbar from '../NavBar';

const AppLayout:React.FC<{children : React.JSX.Element}> = ({children}) => {

  useEffect(() => {
    // Scroll to the top of the page whenever the content (children) changes
    window.scrollTo(0, 0);
  }, [children]);
  return (
    <>
        <Navbar />
        <main>{children}</main>
    </>
  )
}

export default AppLayout