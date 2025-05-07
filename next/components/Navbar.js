import Image from "next/image"
import Link from "next/link"

const homeImgPath = "/home-icon.png"
const productIconPath = "/product-icon.png"
const debtorIconPath = "/debtor-icon.png"

const Navbar = () => {
    return (
        <header className="flex flex-row items-center justify-around bg-amber-50 p-0.5 shadow-xl shadow-stone-950 ">
            <div className="cursor-pointer">
                <Link href="/">
                    <Image src={homeImgPath} alt="Home Logo" width={30} height={30} />
                </Link>
            </div>
            <div className="cursor-pointer">
                <Link href="#">
                    <Image src={debtorIconPath} alt="debtor Logo" width={30} height={30} />
                </Link>
            </div>
            <div className="cursor-pointer">
                <details className="dropdown">
                    <summary className="btn m-1 bg-amber-50 border-amber-50 shadow-none"><Image src={productIconPath} alt="Product Logo" width={30} height={30} /></summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><Link href="/products">ดูรายการสินค้า</Link></li>
                        <li><Link href="/products/add-product">เพิ่มสินค้า</Link></li>
                    </ul>
                </details>
            </div>
        </header>
    )
}

export default Navbar