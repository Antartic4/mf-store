import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}
function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (userId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('User deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Users">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="card text-center pt-5 ">
          <ul>
            <li>
              <Link legacyBehavior href="/admin/dashboard">
                <a className="text-blue-500 hover:text-blue-700">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/admin/orders">
                <a className="text-blue-500 hover:text-blue-700">Ordenes</a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/admin/products">
                <a className="text-blue-500 hover:text-blue-700">Productos</a>
              </Link>
            </li>
            <li className="pb-5">
              <Link legacyBehavior href="/admin/users">
                <a className="font-bold text-xl">Usuarios</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Usuarios</h1>
          {loadingDelete && <div>Eliminando...</div>}
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NOMBRE</th>
                    <th className="p-5 text-left">EMAIL</th>
                    <th className="p-5 text-left">ADMIN</th>
                    <th className="p-5 text-left">ACCION</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-5 ">{user._id.substring(20, 24)}</td>
                      <td className="p-5 ">{user.name}</td>
                      <td className="p-5 ">{user.email}</td>
                      <td className="p-5 ">{user.isAdmin ? 'SI' : 'NO'}</td>
                      <td className="p-5 ">
                        <Link
                          legacyBehavior
                          href={`/admin/user/${user._id}`}
                          passHref
                        >
                          <a type="button" className="default-button">
                            Editar
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          type="button"
                          className="default-button"
                          onClick={() => deleteHandler(user._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
AdminUsersScreen.auth = { adminOnly: true };
export default AdminUsersScreen;
