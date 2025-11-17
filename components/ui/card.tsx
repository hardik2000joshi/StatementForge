import * as React from "react";
import {cn} from "@/lib/utils";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { renderToHTMLImpl } from "next/dist/server/render";

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

export function CardHeader({
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

export function CardFooter ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className= {cn("p-4 pt-0 flex items-center justify-between", className)}
        {...props} 
        />
    );
}

export function CardTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return(
        <h3 className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
        />
    );
}