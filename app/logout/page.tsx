"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/login");
        }, 10000); // 10 seconds
        return () => clearTimeout(timer);
    }, [router]);

    return(
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-gray-600">
                Logging Out... <br /> 
                Please login to access My Account
            </p>
        </div>
    );
}