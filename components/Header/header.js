import Link from 'next/link';

const Header = () => {
   return (
      <div className='header-container'>
         <div className='header-column1'>
            <Link href='/'><a className='header-link'>Home</a></Link>
         </div>
         {/* <div className='header-img'>
            <img src="/omega.png" alt=""/>
         </div> */}
      </div>
   )
}

export default Header;