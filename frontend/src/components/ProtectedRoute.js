import React from 'react';
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({loggedIn, component}) {
  return loggedIn ? component : <Navigate to="/signin" />
}