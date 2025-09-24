
import { connectDB } from "@/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    await connectDB();

    const {email, password} = await req.json();

    const user = await User.findOne({email});
    if (!user) {
        return NextResponse.json(
            {
            error: "User not found"
        },
        {
            status: 401
        });
    }

    return NextResponse.json({
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
    });
}