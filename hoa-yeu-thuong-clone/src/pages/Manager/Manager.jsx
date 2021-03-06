import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import './Manager.scss'
import { baseUrl } from './../../constants/url';
const queryString = require('query-string')

export function ManagerSummarySales(props) {
    function isNumber(n) {
        return ((Number(n) === n && n % 1 !== 0) || (Number(n) === n && n % 1 === 0));
    }

    const [compare, setCompare] = useState(false)

    const [revenue2, setRevenue2] = useState(null)

    const [compareValue, setCompareValue] = useState('')

    const [date2, setDate2] = useState(
        new Date('2021-03-15T00:00:00.000')
    )
    const [selectedDate2, setSelectedDate2] = React.useState({
        month: 3,
        year: 2021,
    });

    const query2 = queryString.stringify(selectedDate2)

    const handleDateChange2 = (date) => {
        setDate2(date)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        setSelectedDate2({
            month: month,
            year: year,
        });

    };




    const [revenue, setRevenue] = useState(null)

    const [date, setDate] = useState(
        new Date('2021-03-15T00:00:00.000')
    )
    const [selectedDate, setSelectedDate] = React.useState({
        month: 3,
        year: 2021,
    });

    const query = queryString.stringify(selectedDate)

    const handleDateChange = (date) => {
        setDate(date)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        setSelectedDate({
            month: month,
            year: year,
        });

    };

    useEffect(() => {
        if (revenue != 0 && revenue2 != 0 && revenue && revenue2) {
            setCompareValue((100 - (revenue / revenue2) * 100).toFixed(1))
        }
        else {
            setCompareValue(null)
        }
    }, [revenue, revenue2])

    const handleSubmit = () => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/summary/invoices?${query}`)
                let price = 0
                res.data.forEach((item) => {
                    price += item.TONGTIEN
                })
                setRevenue(price)
            } catch (error) {
                console.log(error)
            }
        }

        getProduct()
    }



    const handleSubmit2 = () => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/summary/invoices?${query2}`)
                let price = 0
                res.data.forEach((item) => {
                    price += item.TONGTIEN
                })
                setRevenue2(price)
            } catch (error) {
                console.log(error)
            }
        }

        getProduct()
    }



    return (
        <div className='summary'>
            <h1>
                Doanh thu
            </h1>
            <div className='product-list__page'
                style={{ marginBottom: '24px' }}
                onClick={() => setCompare(!compare)}
            >
                {!compare ? 'So s??nh' : 'Hu??? so s??nh'}
            </div>

            <div className='summary--wrapper'>

                <div className='summary__item' style={{ marginRight: '24px' }}>
                    <div className='summary__month-picker'>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <DatePicker
                                    //dateFormat='dd-mm-yyyy'
                                    variant="inline"
                                    openTo="year"
                                    views={["year", 'month']}
                                    label="Year and Month"
                                    helperText="Start from year selection"
                                    value={date}
                                    onChange={handleDateChange}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div className='product-list__page'
                        onClick={() => handleSubmit()}
                    >
                        Ch???n
                    </div>

                    <div>
                        <p>
                            {revenue && revenue?.length == 0 ? <div>Kh??ng c?? doanh thu th??ng n??y</div> : <div>Doanh thu th??ng n??y {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(revenue)}</div>}
                        </p>
                    </div>
                </div>
                {
                    compare ?
                        <div className='summary__item'>

                            <div className='summary__month-picker'>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <DatePicker
                                            //dateFormat='dd-mm-yyyy'
                                            variant="inline"
                                            openTo="year"
                                            views={["year", 'month']}
                                            label="Year and Month"
                                            helperText="Start from year selection"
                                            value={date2}
                                            onChange={handleDateChange2}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>

                            <div className='product-list__page'
                                onClick={() => handleSubmit2()}
                            >
                                Ch???n
                            </div>

                            <div>
                                <p>
                                    {revenue2 && revenue2?.length == 0 ? <div>Kh??ng c?? doanh thu th??ng n??y</div> : <div>Doanh thu th??ng n??y {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(revenue2)}</div>}
                                </p>
                            </div>
                        </div> : ''
                }

            </div>

            {
                <div className='summary__kl'>
                    {
                        compare && isNumber(Number(compareValue)) && revenue && revenue2 ? `Doanh thu th??ng ${date.getMonth() + 1}/${date.getYear() + 1900} n??y so v???i th??ng ${date2.getMonth() + 1}/${date2.getYear() + 1900} ${compareValue < 0 ? 'gi???m' : 't??ng'}:  ` + Math.abs(compareValue) + '%' : ''
                    }
                </div>
            }

        </div>
    )
}

export function ManagerSummaryBestProduct(props) {

    const [products, setProducts] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/products`, {
                params: {
                    page: 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then((res) => {
                setProducts(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [isDesc])

    const handleAddProduct = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/summary/products`, {
                params: {
                    page: page + 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then(
                (res) => setProducts([...products, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='admin-history'>
            <h1>
                {!isDesc ? 'S???n ph???m b??n ch???m' : 'S???n ph???m b??n ch???y'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {isDesc ? 'S???n ph???m b??n ch???m' : 'S???n ph???m b??n ch???y'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>S??? th??? t???</th>
                    <th>M?? s???n ph???m</th>
                    <th>T??n s???n ph???m</th>
                    <th>S??? l?????ng ???? b??n</th>
                </tr>
                {
                    products.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MASP}</td>
                                <td>{ele.TENSP}</td>
                                <td>{ele.TONGSOLUONG}</td>
                            </tr>

                        </>
                    ))
                }
            </table>

            <div className='admin-card__page'
                onClick={() => handleAddProduct()}
            >
                Xem th??m
            </div>
        </div>
    )
}

export function ManagerSummaryAmountProduct(props) {

    const [products, setProducts] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/products-amount`, {
                params: {
                    page: 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then((res) => {
                setProducts(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [isDesc])

    const handleAddProduct = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/summary/products-amount`, {
                params: {
                    page: page + 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then(
                (res) => setProducts([...products, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='admin-history'>
            <h1>
                {!isDesc ? 'S???n ph???m c?? s??? l?????ng th???p' : 'S???n ph???m c?? s??? l?????ng cao'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {isDesc ? 'S???n ph???m c?? s??? l?????ng th???p' : 'S???n ph???m c?? s??? l?????ng cao'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>S??? th??? t???</th>
                    <th>M?? s???n ph???m</th>
                    <th>T??n s???n ph???m</th>
                    <th>S??? l?????ng h??ng</th>
                </tr>
                {
                    products.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MASP}</td>
                                <td>{ele.TENSP}</td>
                                <td>{ele.SOLUONG}</td>
                            </tr>

                        </>
                    ))
                }
            </table>

            <div className='admin-card__page'
                onClick={() => handleAddProduct()}
            >
                Xem th??m
            </div>
        </div>
    )
}

export function ManagerSummaryStaffsBySale(props) {

    const [staffs, setStaffs] = useState([])

    const [isDesc, setIsDesc] = useState(true)

    const [page, setPage] = useState(1)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/summary/staffs-sales`, {
                params: {
                    page: 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then((res) => {
                setStaffs(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [isDesc])

    const handleAddStaffs = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/summary/staffs-sales`, {
                params: {
                    page: page + 1,
                    isDesc: isDesc ? 'desc' : 'asc',
                }
            }).then(
                (res) => setStaffs([...staffs, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='admin-history'>
            <h1>
                {isDesc ? 'Nh??n vi??n c?? doanh s??? gi???m d???n' : 'Nh??n vi??n c?? doanh s??? t??ng d???n'}
            </h1>
            <div className='admin-card__page'
                onClick={() => { setIsDesc(!isDesc); setPage(1) }}
            >
                {!isDesc ? 'Nh??n vi??n c?? doanh s??? gi???m d???n' : 'Nh??n vi??n c?? doanh s??? t??ng d???n'}
            </div>
            <table style={{ marginTop: '16px' }}>
                <tr>
                    <th>S??? th??? t???</th>
                    <th>M?? nh??n vi??n</th>
                    <th>T??n nh??n vi??n</th>
                    <th>Doanh s???</th>
                    <th>S??? l?????ng ????n</th>
                    <th>Doanh s??? tr??n ????n</th>
                </tr>
                {
                    staffs.map((ele, idx) => (
                        <>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{ele.MANV}</td>
                                <td>{ele.TENNV}</td>
                                <td>
                                    {
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGDONHANG)
                                    }
                                </td>
                                <td>{ele.SOLUONGDON}</td>
                                <td>
                                    {
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGDONHANG / ele.SOLUONGDON)
                                    }
                                </td>

                            </tr>

                        </>
                    ))
                }
            </table>

            <div className='admin-card__page'
                onClick={() => handleAddStaffs()}
            >
                Xem th??m
            </div>
        </div>
    )
}

