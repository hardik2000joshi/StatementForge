import * as React from "react";
import {cn} from "@/lib/utils";
import { propagateServerField } from "next/dist/server/lib/render-server";

export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
        className={cn (
            "rounded-2xl border bg-white shadow-sm text-gray-900",
            className
        )}
        {...props}
        />
    );
}

export function cardHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-4 pt-2 text-sm text-gray-700", className)} 
        {...props}
        />
    );
}

export  function CardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-4 pt-2 text-sm text-gray-700", className)} 
        {...props} 
        />
    );
}

export function cardFooter ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className= {cn("p-4 pt-0 flex items-center justify-between", className)}
        {...props} 
        />
    );
}