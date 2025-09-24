import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs"

export async function POST(req:Request) {
    try {
        const {email, password} = await req.json();

        if (!email || !password) {
            return NextResponse.json({Error: "Email and Password are required"}, {status: 400});
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const usersCollection= db.collection("Users");

        // check if user exists
        const user = await usersCollection.findOne({email});

        if (!user) {
            return NextResponse.json({error: "Invalid email or password"}, 
                {status: 401}
            );
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({error: "Invalid email or password"},
                {status: 401}
            );
        }

        // return user (omit password before sending)
        const {password: _, ...userWithoutPassword} = user;

        return NextResponse.json(userWithoutPassword, {status: 200});
    }
    catch(err) {
        console.error("Login error", err);
        return NextResponse.json({error: "Internal Server Error"},
            {status: 500}
        );
    }
}