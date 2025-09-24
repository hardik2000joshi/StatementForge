import clientPromise from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const usersCollection = db.collection("Users");

        const {firstName, lastName, email, password} = await req.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                {error: "All fields are required"},
                {status: 400}           
            );
        }

        // check if user already exists
        const existingUser = await usersCollection.findOne({email});
        if (existingUser) {
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            );
        }

        // insert new user
        const newUser = {
            name: `${firstName} ${lastName}`,
            email,
            password,
            role: "User",
            organization: null,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

         return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      { status: 201 }
    );

    }
    catch(err: any) {
        console.error("Signup error:", err);
        return NextResponse.json(
            {error: "Something Went Wrong"},
            {status: 500}       
        );
    }
}