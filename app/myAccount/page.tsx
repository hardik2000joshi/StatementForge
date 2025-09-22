"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";
import { Building2, Mail, UserIcon } from "lucide-react";

export default function MyAccountPage() {
    const {user, logoutUser} = useUser();
    const router = useRouter();

    if (!user) {
        router.push("/login");
        return null;
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

            {/* Account Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Details
                </h2>

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
                        <Building2 className="h-4 w-4"/>
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
            </div>

            <button
            onClick={() => {
                logoutUser();
                router.push("/login");
            }}
            className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
                Log Out
            </button>
        </div>
    );
}