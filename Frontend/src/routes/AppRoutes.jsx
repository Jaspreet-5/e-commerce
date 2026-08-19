import { Route, Routes } from 'react-router-dom'
import LoginPage from '../Auth/pages/LoginPage'
import SignupPage from '../Auth/pages/SignupPage'
import ProtectedRoutes from './ProtectedRoutes'
import MainLayout from '../layouts/MainLayout'
import ProuductPage from '../Products/pages/ProuductPage'
import AdminProtectedRoutes from './AdminProtectedRoutes'
import AdminProductPage from '../Admin/pages/AdminProductPage'
import AdminProductUpload from '../Admin/components/AdminProductUpload'
import AdminProductEditPage from '../Admin/pages/AdminProductEditPage'
import CartPage from '../Cart/pages/CartPage'
import OrderPage from '../Order/pages/OrderPage'
import IndividualProductPage from '../Products/pages/IndividualProductPage'

const AppRoutes = () => {
  return (
    <>

      {/*  ~~~    Public Routes   ~~~    */}


      <Routes >

        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />



        {/* Routes With Navbar */}

        <Route element={<MainLayout />}>products

          <Route path='/products' element={<ProuductPage />} />
          <Route path='/product/:productId' element={<IndividualProductPage />}  />





          {/*  ~~~    Protected Routes   ~~~    */}

          <Route element={<ProtectedRoutes />}>

            Cart Route
            <Route path='/cart' element={<CartPage />}/>


            {/* Order Routes */}
            <Route path='/checkout' element={<OrderPage />}/>

        {/*<Route path='/place-order' /> */}


          </Route>


          {/*  ~~~    Admin Protected Routes   ~~~    */}

          <Route element={<AdminProtectedRoutes />}>

            <Route
              path="/admin/upload-product"
              element={<AdminProductUpload />}
            />

            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductEditPage />}
            />

            <Route
              path='/admin/products'
              element={<AdminProductPage />}
            />

          </Route>

        </Route>


      </Routes>

    </>
  )
}

export default AppRoutes;
