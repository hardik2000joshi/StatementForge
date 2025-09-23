"use client";

import { channel } from "diagnostics_channel";
import { createContext, ReactNode, useContext, useState } from "react";

// context to hold active tab state
interface TabsContextValue {
    value: string;
    setValue: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

// Tabs Wrapper
interface TabsProps {
    defaultValue: string;
    children: ReactNode;
    className?: string;
}

export function Tabs ({defaultValue, children, className}: TabsProps) {
    const [value, setValue] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{value, setValue}}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: ReactNode;
    className?: string;
}

export function TabsList({children, className} : TabsListProps) {
    return <div className="className">
        {children}
    </div>; 
}

// Tabs Trigger (tab button)
interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function TabsTrigger({value, children, className}: TabsTriggerProps) {
    const context = useContext(TabsContext);
    if (!context)
        throw new Error("TabsTrigger must be used inside Tabs");
    const isActive = context.value === value;

    return (
        <button
      onClick={() => context.setValue(value)}
      className={`${className} px-4 py-2 rounded-t-lg ${
        isActive
          ? "border-b-2 border-blue-600 font-semibold text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
    );
}

// Tabs Content (show active tab)
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");

  if (context.value !== value) return null;

  return <div className={className}>{children}</div>;
}
