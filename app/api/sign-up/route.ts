import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const usersCollection = db.collection("Users");

        // Include fiels in request body
        const {firstName, lastName, email, password, role, organization} = await req.json();

        if (!firstName || !lastName || !email || !password || !role || !organization) {
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

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // insert new user
        const newUser = {
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            role,
            organization,
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
        organization: newUser.organization,
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