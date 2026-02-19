// src/components/layout/MainLayout.jsx
import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../Navbar";

export default function MainLayout() {
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    );
}
