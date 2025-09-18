  "use client";

  import { Briefcase, Building2, Factory, File, FileText, Icon, PenTool, Settings, Tags, User } from "lucide-react";
  import Link from "next/link";
  import { usePathname } from "next/navigation";

  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
      {href: "/companies", label: "Companies", icon: Building2},
      {href: "/templates", label: "Templates", icon: FileText},
      {href: "/generator", label: "Generator", icon: PenTool},
      {href: "/vendors", label: "Vendors", icon: Briefcase},
      {href: "/vendorCategories", label:"Vendor Categories", icon: Tags},
      {href: "/industries", label:"Industries", icon: Factory},
      {href: "/invoices", label:"Invoices", icon: File},
    ];

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* header */}  
        <header className="flex items-center justify-between bg-white px-6 h-14 border-b shadow-sm">
          <h1 className="text-xl font-semibold flex items-center gap-2">

            <File className="h-5 w-5 text-blue-600"/>
            Docuforge
            </h1> 

            <div className="flex items-center gap-4">
              <Link href="/settings" 
              className="p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-600"/>
                </Link>
                
              <button className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-600"/>
              </button>
            </div>
        </header>

        {/* Horizontal Nav*/}
          <nav className="bg-white border-b shadow-sm">
            <div className="flex gap-6 px-6 h-12 items-center text-sm font-medium">
              {navItems.map((item)=> {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

               return(
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 text-gray-900"
                }`}
                >
                  <Icon className="h-4 w-4"/>
                {item.label}
                </Link>
              );
              })}
              </div>
            </nav>

        <main className="flex-1 bg-gray-100 p-8">{children}</main>
      </div>
            );
          }