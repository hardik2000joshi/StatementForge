"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";
import { Building2, Mail, UserIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";

export default function MyAccountPage() {
    const {user, logoutUser} = useUser();
    const router = useRouter();

    // prevent flicker: render nothing while redirecting
    if (!user) {
        return(
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">
                    You must log in to access this page
                </p>
            </div>
        );
    }

    return(
        <div className="flex-1 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <UserIcon className="h-8 w-8 text-blue-600"/>
                <h1 className="text-3xl font-bold text-gray-900">
                    My Account
                </h1>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile"
            className="w-full"
            >
                <TabsList className="flex space-x-4 border-b">
                    <TabsTrigger value="profile">
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="payments">
                        Payments
                        </TabsTrigger>
                        <TabsTrigger value="apiKeys">
                            API Keys
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                Settings
                                </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <div className="space-y-3 text-gray-600">
                        <div className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                            <span>
                                {user.name}
                                </span>
                                 </div>

                                 <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>
                                        {user.email}
                                        </span>
                                        </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>
                {user.organization}
              </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                    Role:
                    </span>
              <span>
                {user.role}
                </span>
            </div>
                    </div>
                    </TabsContent>

                    {/* Payments Tab */}
                    <TabsContent 
                    value="payments"
                    className="mt-6"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">
                            <p>
                                Payment history will appear here.
                            </p>
                        </div>
                    </TabsContent>

                    {/* API Keys Tab */}
                    <TabsContent 
                    value="apiKeys"
                    className="mt-6"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">
                            <p>Your API keys will appear here.</p>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent 
                    value="settings"
                    className="mt-6"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">
                            <p>
                                Settings and preferences will appear here.
                            </p>
                        </div>
                    </TabsContent>
            </Tabs>

            {/*  Logout */}
            <button
            onClick={() => {
                logoutUser();
                router.push("/logout");
            }}
            className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
                Log Out
            </button>
        </div>
    );
}