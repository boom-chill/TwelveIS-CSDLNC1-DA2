import React, { useEffect, useState } from 'react';
import './AdminHistory.scss'
import { baseUrl } from './../../constants/url';
import axios from 'axios';
import { dateFormat } from '../../utils/dateFormat';

function AdminHistory(props) {
    const [importPage, setImportPage] = useState(1)
    const [exportPage, setExportPage] = useState(1)

    const [isImports, setIsImports] = useState(true)
    const [imports, setImports] = useState([])
    const [exportsBallot, setExportsBallot] = useState([])
    const [details, setDetails] = useState([])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/imports`, {
                params: {
                    page: importPage
                }
            }).then((res) => setImports(res.data))

            axios.get(`${baseUrl}/api/exports`, {
                params: {
                    page: exportPage
                }
            }).then((res) => setExportsBallot(res.data))

        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleAddImports = () => {
        setImportPage(importPage + 1)
        try {
            axios.get(`${baseUrl}/api/imports`, {
                params: {
                    page: importPage + 1,
                }
            }).then(
                (res) => setImports([...imports, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddExports = () => {
        setExportPage(importPage + 1)
        try {
            axios.get(`${baseUrl}/api/exports`, {
                params: {
                    page: exportPage + 1,
                }
            }).then(
                (res) => setExportsBallot([...exportsBallot, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeSite = () => {
        setIsImports(!isImports)
    }

    const handleViewImDetail = (id) => {
        try {
            axios.get(`${baseUrl}/api/imports/${id}`).then(
                (res) => setDetails([...details, ...res.data])
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleViewExDetail = (id) => {

    }

    return (
        <div className='admin-history'>
            <h1>
                {!isImports ? 'Phi???u xu???t' : 'Phi???u nh???p'}
            </h1>

            <div className='product-list__page'
                onClick={() => handleChangeSite()}
            >
                {isImports ? 'Phi???u xu???t' : 'Phi???u nh???p'}
            </div>
            {isImports ?

                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>M?? phi???u nh???p</th>
                        <th>T??n nh?? cung ???ng</th>
                        <th>?????a ch??? chi nh??nh</th>
                        <th>S??? ??i???n tho???i chi nh??nh</th>
                        <th>Ng??y l???p</th>
                        <th>Tr???ng th??i</th>
                        {/* <th>Xem chi ti???t</th> */}
                    </tr>
                    {
                        imports.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.MAPHIEUNHAP}</td>
                                    <td>{ele.TEN}</td>
                                    <td>{ele.DIACHI}</td>
                                    <td>{ele.SDT}</td>
                                    <td>{
                                        dateFormat(ele.NGAYLAP)
                                    }</td>
                                    <td>{ele.TRANGTHAI}</td>
                                    {/* <td
                                        onClick={() => handleViewImDetail(ele.MAPHIEUNHAP)}
                                    >Xem</td> */}
                                </tr>
                                {
                                    details.map((deEle) => (
                                        <>
                                            {
                                                ele.MAPHIEUNHAP == deEle.MAPHIEUNHAP
                                                    ?

                                                    <tr>
                                                        <td>T??n s???n ph???m: {deEle.TENSP}</td>
                                                        <td>S??? l?????ng: {deEle.SOLUONG}</td>
                                                    </tr>


                                                    : ""
                                            }
                                        </>
                                    ))
                                }


                            </>
                        ))
                    }
                </table>
                : // exports
                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>M?? phi???u xu???t</th>
                        <th>T??n nh?? cung ???ng</th>
                        <th>?????a ch??? chi nh??nh</th>
                        <th>S??? ??i???n tho???i chi nh??nh</th>
                        <th>Ng??y l???p</th>
                        <th>T???ng ti???n</th>
                        {/* <th>Xem chi ti???t</th> */}
                    </tr>
                    {
                        exportsBallot.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.MAPHIEUXUAT}</td>
                                    <td>{ele.TEN}</td>
                                    <td>{ele.DIACHI}</td>
                                    <td>{ele.SDT}</td>
                                    <td>{
                                        dateFormat(ele.NGAYLAP)
                                    }</td>
                                    <td>{
                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ele.TONGTIEN)
                                    }</td>
                                    {/* <td
                                        onClick={() => handleViewExDetail(ele.MAPHIEUNHAP)}
                                    >Xem</td> */}
                                </tr>
                                {
                                    details.map((deEle) => (
                                        <>
                                            {
                                                ele.MAPHIEUNHAP == deEle.MAPHIEUNHAP
                                                    ?

                                                    <tr>
                                                        <td>T??n s???n ph???m: {deEle.TENSP}</td>
                                                        <td>S??? l?????ng: {deEle.SOLUONG}</td>
                                                    </tr>


                                                    : ""
                                            }
                                        </>
                                    ))
                                }


                            </>
                        ))
                    }
                </table>
            }

            <div className='product-list__page'
                onClick={isImports ? () => handleAddImports() : () => handleAddExports()}
            >
                Xem th??m
            </div>
        </div>
    );
}

export default AdminHistory;