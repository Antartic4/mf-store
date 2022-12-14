/* eslint-disable @next/next/no-page-custom-font */
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { getError } from '../utils/error';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import Cookies from 'js-cookie';
import Image from 'next/image';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios';
import { useRouter } from 'next/router';
import { US, ES } from 'country-flag-icons/react/3x2';

export default function Layout({ title, children }) {
  const classes = useStyles();

  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };

  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      toast(getError(err), { variant: 'error' });
    }
  };

  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  let nav_home = router.locale === 'en' ? 'Home' : 'Inicio';

  let nav_shop = router.locale === 'en' ? 'Shop' : 'Tienda';

  let nav_cart = router.locale === 'en' ? 'Cart' : 'Carrito';

  let nav_aboutus = router.locale === 'en' ? 'About Us' : 'Sobre Nosotros';

  let nav_search =
    router.locale === 'en' ? 'Search Products' : 'Buscar Productos';

  let nav_profile = router.locale === 'en' ? 'Profile' : 'Perfil';

  let nav_historyorders =
    router.locale === 'en' ? 'Order History' : 'Historial Ordenes';

  let nav_adminportal =
    router.locale === 'en' ? 'Admin Portal' : 'Portal de Admin';

  let nav_logout = router.locale === 'en' ? 'Logout' : 'Cerrar Session';

  let nav_login = router.locale === 'en' ? 'Login' : 'Iniciar sesi??n';

  let nav_myprofile = router.locale === 'en' ? 'My Profile' : 'Mi Perfil';

  return (
    <>
      <Head>
        <title>{title ? title + ' - Store' : 'MF - Store'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex flex-col justify-between min-h-screen">
        <header className="z-10">
          <div className="pt-28">
            <nav className="fixed top-0 left-0 w-full bg-white shadow">
              <div className="container flex items-center justify-between m-auto text-gray-700">
                {/* SideBar Button + Menu */}
                <div className="block px-4 py-3 mx-2 xl:hidden focus:outline-none">
                  <Box display="flex" alignItems="center">
                    <IconButton
                      edge="start"
                      aria-label="open drawer"
                      onClick={sidebarOpenHandler}
                    >
                      <MenuIcon className={classes.navbarButton} />
                    </IconButton>
                  </Box>
                  <Drawer
                    anchor="left"
                    open={sidebarVisible}
                    onClose={sidebarCloseHandler}
                  >
                    <List>
                      <ListItem>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          className="flex"
                        >
                          <Typography className="py-2 text-center">
                            <h1 className="font-bold">
                              {router.locale === 'en'
                                ? 'Shopping by Category'
                                : 'Comprando por Categoria'}
                            </h1>
                          </Typography>
                          <IconButton
                            aria-label="close"
                            onClick={sidebarCloseHandler}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider light />
                      <Box>
                        <div className="px-3 text-center py-3 font-bold hover:bg-gray-200">
                          <Link href="/">{nav_home}</Link>
                        </div>
                        <div className="px-3 py-3 text-center font-bold hover:bg-gray-200">
                          <Link href="/">{nav_shop}</Link>
                        </div>
                        <div className="px-3 py-3 text-center hover:bg-gray-200">
                          <Link legacyBehavior href="/cart">
                            <div className="item-center">
                              <h1 className="font-bold text-center">
                                {nav_cart}
                              </h1>
                            </div>
                          </Link>
                        </div>
                        <div className="px-3 py-3 text-center font-bold hover:bg-gray-200">
                          <Link href="/aboutus">{nav_aboutus}</Link>
                        </div>
                        <Divider light />
                        <div className="px-3 py-3 text-center font-bold hover:bg-gray-200">
                          <Link href="/profile">{nav_myprofile}</Link>
                        </div>
                        <Divider light />
                        <div className="px-3 py-3 text-center items-center font-bold hover:bg-gray-200">
                          <Link href="/search">
                            <h1 className="text-center items-center flex justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                              </svg>
                              {nav_search}
                            </h1>
                          </Link>
                        </div>
                      </Box>
                    </List>
                  </Drawer>
                </div>
                <div className="flex items-center">
                  <button onClick={sidebarOpenHandler} className="mr-5">
                    <a className="px-4">
                      <Link legacyBehavior href="/">
                        <Image
                          src="https://i.ibb.co/nRPJC8J/improved-l-1.png"
                          className="flex shrink-0"
                          alt="improved-l-1"
                          border="0"
                          width={50}
                          height={75}
                        />
                      </Link>
                    </a>
                  </button>
                  <div className="">
                    <Link href="/">
                      <buttton className="font-bold shrink">
                        {router.locale === 'en' ? (
                          <div className="md:flex text-2xl">
                            <h4 className="text-left shrink">M A R I E L</h4>
                            <h4 className="text-left shrink md:pl-5">
                              F R I A S
                            </h4>
                          </div>
                        ) : (
                          <div className="md:flex text-xl">
                            <h4 className="text-left shrink">M A R I E L</h4>
                            <h4 className="text-left shrink md:pl-5">
                              F R I A S
                            </h4>
                          </div>
                        )}
                      </buttton>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <ul className="items-center hidden pr-10 text-base font-semibold cursor-pointer xl:flex">
                    <li className="px-3 py-3 hover:bg-gray-200">{nav_home}</li>
                    <li className="px-3 py-3 hover:bg-gray-200">{nav_shop}</li>
                    <li className="px-3 py-3 hover:bg-gray-200">
                      <Link legacyBehavior href="/cart">
                        <div className="flex items-center justify-between">
                          {nav_cart}
                        </div>
                      </Link>
                    </li>
                    <li className="px-3 py-3 text-center items-center hover:bg-gray-200">
                      <Link legacyBehavior href="/aboutus">
                        <div>{nav_aboutus}</div>
                      </Link>
                    </li>
                  </ul>
                  <ul className="items-center hidden text-base font-semibold cursor-pointer justify-evenly xl:flex">
                    <li className="px-3 py-3">
                      <div className={classes.searchSection}>
                        <form
                          onSubmit={submitHandler}
                          className={classes.searchForm}
                        >
                          <InputBase
                            name="query"
                            className={classes.searchInput}
                            placeholder={nav_search}
                            onChange={queryChangeHandler}
                          />
                          <IconButton
                            type="submit"
                            className={classes.iconButton}
                            aria-label="search"
                          >
                            <SearchIcon />
                          </IconButton>
                        </form>
                      </div>
                    </li>
                    <li className="px-2 py-4">
                      <div>
                        <Link legacyBehavior href="/cart">
                          <div className="flex items-center justify-between">
                            <a className="hover:text-red-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="black"
                                className="w-8 h-8 hover:fill-red-300"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                />
                              </svg>
                            </a>
                            {cartItemsCount > 0 && (
                              <Link legacyBehavior href="/cart">
                                <span className="p-0.5 px-1 py-1 font-medium text-white bg-black rounded-full">
                                  <p className="text-sm">{cartItemsCount}</p>
                                </span>
                              </Link>
                            )}
                          </div>
                        </Link>
                      </div>
                    </li>
                    <li className="pl-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="black"
                        className="w-8 h-8 hover:text-red-400 hover:fill-red-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center pr-2 justify-center">
                  <div className="">
                    {status === 'loading' ? (
                      'Cargando...'
                    ) : session?.user ? (
                      <div className="p-1.5 bg-black rounded-md">
                        <Menu
                          as="div"
                          className="relative inline-block text-m "
                        >
                          <Menu.Button className="text-white">
                            <h1 className="text-l">{session.user.name}</h1>
                          </Menu.Button>
                          <Menu.Items className="absolute right-0 z-10 w-56 pt-5 text-xl origin-top-right bg-white shadow-lg rounded-b-xl ">
                            <Menu.Item>
                              <DropdownLink
                                className="dropdown-link"
                                href="/profile"
                              >
                                {nav_profile}
                              </DropdownLink>
                            </Menu.Item>
                            <Menu.Item>
                              <DropdownLink
                                className="dropdown-link "
                                href="/order-history"
                              >
                                {nav_historyorders}
                              </DropdownLink>
                            </Menu.Item>
                            {session.user.isAdmin && (
                              <Menu.Item>
                                <DropdownLink
                                  className="dropdown-link"
                                  href="/admin/dashboard"
                                >
                                  {nav_adminportal}
                                </DropdownLink>
                              </Menu.Item>
                            )}
                            <Menu.Item>
                              <a
                                className="dropdown-link"
                                href="#"
                                onClick={logoutClickHandler}
                              >
                                {nav_logout}
                              </a>
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      </div>
                    ) : (
                      <div className="p-1.5 bg-black rounded">
                        <Link legacyBehavior href="/login">
                          <a className="p-2 text-lg text-white hover:text-gray-200">
                            {nav_login}
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
        <main className="container px-4 m-auto mt-4">{children}</main>
        <footer className="text-center pt-3 items-center justify-center h-20 shadow-inner">
          <p className="">Copyright ?? 2022 Mariel Frias - Store</p>
          <div className="flex justify-center">
            <div>
              <Link legacyBehavior href={router.asPath} locale="en">
                <a>
                  <US title="English" width={50} className="pr-1" />
                </a>
              </Link>
            </div>
            <div>
              <Link legacyBehavior href={router.asPath} locale="es">
                <a>
                  <ES title="Espa??ol" width={50} className="pl-1" />
                </a>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
