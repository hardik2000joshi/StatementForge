  "use client";

  import { Briefcase, Building2, Factory, File, FileText, LogIn, PenTool, Settings, Tags, User } from "lucide-react";
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
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* header */}  
        <header className="flex flex-wrap items-center justify-between bg-white px-4 sm:px-6 h-auto sm:h-14 border-b shadow-sm gap-3">
          <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">

            <File className="h-5 w-5 text-blue-600"/>
            Finhelper
            </h1> 

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Link href="/settings" 
              className="p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-600"/>
                </Link>

              <Link 
              href="/user"
              className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-600"/>
              </Link>

              <Link
              href="/sign-up"
              className="px-2 py-1 text-sm rounded-full hover:bg-gray-100"
              >
                Sign Up
              </Link>

              <Link
              href="/login"
              className="px-2 py-1 text-sm rounded-full hover:bg-gray-100"
              >
                Login
              </Link>
            </div>
            
        </header>

        {/* Horizontal Nav*/}
          <nav className="bg-white border-b shadow-sm">
            <div className="flex gap-2 sm:gap-4 px-2 sm:px-6 h-12 items-center text-xs sm:text-sm font-medium overflow-x-auto">
              {navItems.map((item)=> {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

               return(
                <Link
                key={item.href}
                href={item.href}
                className={`flex flex-shrink-0 items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === item.href
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

        <main className="flex-1 bg-gray-100 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-6xl mx-auto">
              {children}
          </div>
          </main>


        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 text-gray-700 px-4 sm:px-6 py-6 sm:py-8 text-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* About Us */}
            <div className="md:pr-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                About Us
              </h3>

              <p className="leading-relaxed text-gray-600">
                This is a professional financial testing platform designed to create realistic sample bank statements for testing, demo, and training purposes. The application enables users to generate high-quality simulated bank statements without exposing real customer data, making it ideal for product teams, QA engineers, sales demonstrations, and educational purposes.
              </p>
            </div>

            {/* Useful Links */}
            <div className="md:px-6 mt-4 md:mt-0">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Useful Links
              </h3>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <Link 
                  href="/"
                  className="hover:text-blue-600 underline"
                  >
                  About Us
                  </Link>
                </li>

                <li>
                  <Link 
                  href="/"
                  className="hover:text-blue-600 underline"
                  >
                  Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link 
                  href="/"
                  className="hover:text-blue-600 underline"
                  >
                  Terms & Conditions
                  </Link>
                </li>

                <li>
                  <Link 
                  href="/contactUs"
                  className="hover:text-blue-600 underline"
                  >
                  Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:pl-6 mt-4 md:mt-0">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Contact Information
                </h3>

                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Contact Us On
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-lg">
                      <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 4h16v16H4V4zm0 0l8 6 8-6"
                         />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Email:
                        <Link href="/" className="text-blue-600 hover:underline text-sm">
                        support@finhelper.com
                        </Link> 
                      </p>
                    </div>
                    </div>       
            </div>
            </div>

            {/* Footer Bottom Centered */}
            <div className="mt-6 sm:mt-8 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()}  <strong>
                FINHELPER              
                </strong> . 
                All rights reserved.
            </div>
        </footer>
          </div>
    );
  }
            