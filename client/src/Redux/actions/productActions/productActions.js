import {PRODUCT_LIST_REQUEST, PRODUCT_LIST_FAIL, PRODUCT_LIST_SUCCESS, PRODUCT_DETAIL_REQUEST,PRODUCT_DETAIL_SUCCESS,PRODUCT_DETAIL_FAIL} from '../actionConsts/productConsts';
import axios from 'axios';



export const listProducts = ()=>async(dispatch)=>{
    dispatch({
        type: PRODUCT_LIST_REQUEST,

    });

    try {
const {data} = await axios.get('/api/products');

    dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data
    })
    } catch (error) {
        dispatch({
            type:PRODUCT_LIST_FAIL,
            payload: error.message
        })
    }
}

export const productItem = (productId)=>async(dispatch)=>{
    dispatch({
        type:PRODUCT_DETAIL_REQUEST,
        payload:productId
    })
    try {
        const {data} = await axios.get(`/api/products/${productId}`);

        dispatch({
            type:PRODUCT_DETAIL_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type:PRODUCT_DETAIL_FAIL,
            payload:error.response && error.response.data.message? error.response.data.message : error.message
        })
    }
}