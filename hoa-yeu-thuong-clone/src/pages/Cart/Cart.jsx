import React, { useEffect, useState } from 'react';
import './Cart.scss'
import '../../all.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { addCart, updateCart, updateDiscount } from '../../feature/cartSlide';
import axios from 'axios';
import { baseUrl } from '../../constants/url';

function Cart(props) {

    let { cnButton, status } = props

    if (cnButton == undefined) {
        cnButton = true
    }

    if (status == undefined) {
        status = true
    }

    const [discount, setDiscount] = useState('')

    const dispatch = useDispatch()
    let products = [...useSelector((state) => state.cart.data)]

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/discount`).then(
                (res) => {
                    dispatch(updateDiscount(res.data.GIAGIAM))
                    setDiscount(res.data.GIAGIAM)
                }
            )
        } catch (error) {

        }
    }, [])

    const intoMoney = () => {
        let money = 0
        products.forEach((product, idx) => {
            money += product.GIAGIAM * product.SLM
        })
        return money
    }

    const totalMoney = () => {
        let money = 0
        money = intoMoney() - discount
        if (money <= 0) {
            money = 0
        }
        return money
    }

    const deleteProduct = (item) => {
        const filteredAry = products.filter((e) => { return e.MASP != item.MASP })
        dispatch(updateCart(filteredAry))
    }

    const plusAmount = (item) => {

        //let cartsTemp = [...products]
        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (item.SOLUONG <= products[objIndex].SLM) return

        products[objIndex] = {
            ...products[objIndex],
            SLM: products[objIndex].SLM + 1,
        }

        dispatch(updateCart(products))
    }

    const minusAmount = (item) => {
        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (products[objIndex].SLM <= 1) return

        products[objIndex] = {
            ...products[objIndex],
            SLM: products[objIndex].SLM - 1,
        }

        dispatch(updateCart(products))
    }

    const handleChangeAMount = (item, value) => {
        if (isNaN(value)) return

        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (item.SOLUONG < value) return

        products[objIndex] = {
            ...products[objIndex],
            SLM: Number(value),
        }

        dispatch(updateCart(products))
        //setCarts(cartsTemp)
    }

    const checkValue = (item) => {
        const objIndex = products.findIndex((e => e.MASP == item.MASP))

        if (products[objIndex].SLM <= 0) {

            products[objIndex].SLM = 1
            dispatch(updateCart(products))
        } else {
            return
        }
    }

    return (
        <div className='wide cart--container' style={!status ? { marginTop: 0 } : { marginTop: '32px' }}>
            {
                products.length > 0
                    ?
                    (<div className='cart'>
                        {
                            status ?
                                (<div className='cart__status'>
                                    <div className='cart__status__item' style={{ backgroundColor: '#43c7d7', color: 'white' }}>
                                        01. Gi??? h??ng
                                    </div>
                                    <div className='cart__status__item'>
                                        02. ????n h??ng
                                    </div>
                                    <div className='cart__status__item'>
                                        03. Thanh to??n
                                    </div>
                                </div>)
                                : <div></div>
                        }

                        <div className='cart__info' style={!status ? { marginTop: 0 } : { marginTop: '24px' }}>

                            <div className='cart__info__title'>
                                <div className='cart__info__item'>
                                    GI??? H??NG ({products.length})
                                </div>
                            </div>

                            <div className='cart__info__items'>
                                {
                                    products.map((product, idx) => (
                                        <div className='cart__info__item'>
                                            <div className='line'></div>
                                            <div className='cart__info__text-title'>
                                                {product.TENSP}
                                            </div>

                                            <div className='cart__info__item--row' >
                                                <p>
                                                    M?? SP:
                                                </p>
                                                <p style={{ color: '#39ab49', fontSize: '16px' }}>
                                                    {product.MASP}
                                                </p>
                                            </div>

                                            <div className='cart__info__item--row price' >
                                                <p>
                                                    ????n gi??:
                                                </p>
                                                <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                                    {
                                                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGIAM)
                                                    }
                                                </p>
                                            </div>

                                            <div className='cart__info__item--row' >
                                                <p>
                                                    S??? l?????ng:
                                                </p>
                                                <button
                                                    onClick={() => minusAmount(product)}
                                                >-</button>
                                                <div
                                                    className='input'
                                                >

                                                    <input
                                                        value={product.SLM}
                                                        onChange={(e) => handleChangeAMount(product, e.target.value)}
                                                        onBlur={() => checkValue(product)}
                                                    />

                                                </div>
                                                <button
                                                    onClick={() => plusAmount(product)}
                                                >+</button>
                                            </div>

                                            <div className='cart__info__item'>
                                                <div className='cart__info__item--delete'
                                                    onClick={() => deleteProduct(product)}>
                                                    X
                                                </div>
                                            </div>
                                        </div>


                                    ))
                                }

                            </div>

                            <div className='cart__info__items'>

                                <div className='cart__info__item'>

                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            T???m t??nh:
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(intoMoney())
                                            }
                                        </p>
                                    </div>

                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            Thu ph??
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)
                                            }
                                        </p>
                                    </div>
                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            Gi???m gi??
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)
                                            }
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className='cart__info__items'>
                                <div className='cart__info__item'>

                                    <div className='cart__info__item--row' >
                                        <p style={{ color: '#bd2026', fontWeight: '500', fontSize: '14px' }}>
                                            T??ng c???ng:
                                        </p>
                                        <p style={{ fontWeight: '500', fontSize: '15px' }}>
                                            {
                                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalMoney())
                                            }
                                        </p>
                                    </div>
                                    {
                                        cnButton ?
                                            (<Link to={'/order'}>
                                                <div className='cart__info__btn'>
                                                    Ti???p t???c
                                                </div>
                                            </Link>)
                                            : <div>

                                            </div>
                                    }
                                </div>

                            </div>

                        </div>
                    </div>)
                    : (<div>
                        <p>

                            Xin ch??o Qu?? kh??ch,
                        </p>

                        <p>

                            Hi???n t???i gi??? h??ng c???a Qu?? kh??ch ch??a c?? s???n ph???m hoa t????i n??o. Xin ti???p t???c ch???n v?? mua s???n ph???m hoa t????i Qu?? kh??ch y??u th??ch.
                        </p>

                        N???u Qu?? kh??ch ??ang g???p kh?? kh??n trong vi???c mua h??ng, Qu?? kh??ch ?????ng ng???n ng???i li??n l???c v???i Hoayeuthuong.com theo c??c ph????ng th???c sau:

                        <p>

                            1. Chat v???i hoa y??u th????ng b???ng khung chat ??? g??c ph???i d?????i m??n h??nh c???a Qu?? kh??ch
                        </p>

                        <p>

                            2. Li??n h??? v???i hoa y??u th????ng qua email: sale@hoayeuthuong.com
                        </p>

                        <p>

                            3. G???i ??i???n tho???i tr???c ti???p cho hoa y??u th????ng theo s??? ??i???n tho???i: 1800 6353
                        </p>

                        <p>
                            Hoa y??u th????ng xin m???t l???n n???a c???m ??n Qu?? kh??ch ???? tin t?????ng s??? d???ng d???ch v??? hoa t????i c???a Ch??ng t??i. N??u c?? s??? b???t ti???n ho???c l???i h??? th???ng xin Qu?? kh??ch th??ng c???m cho Ch??ng t??i.
                        </p>
                    </div>)
            }
        </div >
    );
}

export default Cart;