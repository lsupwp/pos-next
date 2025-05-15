import { useEffect, useState } from "react";
import axios from 'axios';

import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ShowErrorScreen from "@/components/ShowErrorScreen";

const SalesSchedule = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [monthlyProfit, setMonthlyProfit] = useState({});
    const [searchKey, setSearchKey] = useState("");
    const [dailyProfitInMonth, setDailyProfitInMonth] = useState([]);
    const [selectedMonthYear, setSelectedMonthYear] = useState("");

    const filterMonth = Object.entries(monthlyProfit).filter(([monthYear]) =>
        monthYear.toLowerCase().includes(searchKey.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("/api/sales-schedule/all-sales");
                const result = response.data;

                if (result.status === "error") {
                    alert(result.message);
                    return;
                }

                const formattedItems = result.data.map(item => ({
                    ...item,
                    sale_date: formatDate(item.sale_date),
                }));

                const monthlyData = formattedItems.reduce((acc, item) => {
                    const [day, month, year] = item.sale_date.split('/');
                    const monthYearKey = `${year}-${month}`;

                    if (!acc[monthYearKey]) {
                        acc[monthYearKey] = {
                            totalProfit: 0,
                            dailySales: [],
                        };
                    }
                    acc[monthYearKey].totalProfit += parseFloat(item.total_profit);
                    acc[monthYearKey].dailySales.push({ date: item.sale_date, profit: parseFloat(item.total_profit) });
                    return acc;
                }, {});

                setMonthlyProfit(monthlyData);

            } catch (err) {
                alert("Internal server error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatNumberWithCommas = (number) => {
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const openModal = (monthYear) => {
        setSelectedMonthYear(monthYear);
        setDailyProfitInMonth(monthlyProfit[monthYear].dailySales);
        document.getElementById('daily_profit_modal').showModal();
    };

    const closeModal = () => {
        document.getElementById('daily_profit_modal').close();
        setDailyProfitInMonth([]);
        setSelectedMonthYear("");
    };

    if (isLoading) return <Loading />;

    return (
        <>
            <Navbar />
            {Object.keys(monthlyProfit).length > 0 ? (
                <>
                    <div className="flex items-center justify-center w-full p-4">
                        <label className="input w-3/6">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input
                                type="search"
                                className="grow"
                                placeholder="Search Month (YYYY-M)"
                                value={searchKey}
                                onChange={e => setSearchKey(e.target.value)}
                                autoFocus
                            />
                        </label>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>เดือน/ปี</th>
                                    <th>กำไรรวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterMonth.map(([monthYear, data], index) => (
                                    <tr key={monthYear} onClick={() => openModal(monthYear)} className="hover:bg-gray-800 cursor-pointer">
                                        <th>{index + 1}</th>
                                        <td>{monthYear}</td>
                                        <td>{formatNumberWithCommas(data.totalProfit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal ของ DaisyUI */}
                    <dialog id="daily_profit_modal" className="modal">
                        <div className="modal-box max-h-[80vh] flex flex-col"> {/* เปลี่ยนเป็น flex column */}
                            <h3 className="font-bold text-lg sticky top-0 z-10 py-2">กำไรรายวัน - {selectedMonthYear}</h3> {/* Fixed header */}
                            <div className="overflow-y-auto flex-grow"> {/* ให้ส่วนนี้ Scroll ได้ */}
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>วันที่</th>
                                            <th>กำไร</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyProfitInMonth.map((dailySale, index) => (
                                            <tr key={index}>
                                                <td>{dailySale.date}</td>
                                                <td>{formatNumberWithCommas(dailySale.profit)}</td> {/* Format กำไร */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-action sticky bottom-0 z-10 py-2"> {/* Fixed button */}
                                <form method="dialog">
                                    <button className="btn" onClick={closeModal}>ปิด</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </>
            ) : (
                <ShowErrorScreen text="ไม่พบการขายสินค้า" />
            )}
        </>
    );
};

export default SalesSchedule;