"use client"
import React from 'react';
import { auth } from "@/auth";
import { redirect } from 'next/navigation';

export default function WorkSpacePage() {
    // const session = await auth();
    
    // // Se não houver sessão, redireciona para login
    // if (!session?.accessToken) {
    //     redirect('/api/auth/signin?callbackUrl=/workspace');
    // }

    // redirect('/');
    return (
        <h1> hello world </h1>
    )
}

