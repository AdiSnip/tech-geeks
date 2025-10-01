import { NextResponse,NextRequest } from "next/server";
import {User} from "@/models/user.model";

export async function GET(req:NextResponse , {params}:{params:{Token:string}}){
    const {Token} = params;
    const user = await User.findOne({Token});
    if(!user){
        return NextResponse.json({error:"User not found"},{status:404});
    }
    return NextResponse.json({user});
}