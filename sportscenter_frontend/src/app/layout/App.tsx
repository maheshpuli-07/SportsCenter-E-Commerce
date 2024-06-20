import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { CssBaseline, Container, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getBasketFromLocalStorage } from "../util/util";
import { useAppDispatch } from "../store/configureStors";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import agent from "../api/agent";
import { setBasket } from "../../features/basket/basketSlice";
import Spinner from "./Spinner";

export default function App(){
  const [darkMode,setDarkMode]= useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const dispatch = useAppDispatch(); 
  const [loading, setLoading] = useState(true);


useEffect(()=>{
  const basket = getBasketFromLocalStorage();
  dispatch(fetchCurrentUser());
  if(basket){
    agent.Basket.get()
    .then(basket=>dispatch(setBasket(basket)))
    .catch(error=>console.log(error))
    .finally(()=>setLoading(false))
  }else{
    setLoading(false);
  }
})

  const theme =createTheme({
    palette:{
      mode:paletteType,
    }
  })
  function handleThemeChange(){
    setDarkMode(!darkMode);
  }
  if(loading){
    return <Spinner message="Getting Basket..."/>
  }
  return (
    <>
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Toolbar /> {/* This Toolbar acts as a spacer to push content below the AppBar */}
      <Container sx={{ paddingTop:"64px"}}>
        <Outlet />
      </Container>
      </ThemeProvider>
    </>
  );
}




