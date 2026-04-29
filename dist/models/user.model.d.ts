import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";
declare const userSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    username: string;
    email: string;
    password: string;
    otp?: string | null;
    otpExpiry?: NativeDate | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
    otp?: string | null;
    otpExpiry?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    username: string;
    email: string;
    password: string;
    otp?: string | null;
    otpExpiry?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    username: string;
    email: string;
    password: string;
    otp?: string | null;
    otpExpiry?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type UserDocument = InferSchemaType<typeof userSchema> & {
    otp?: string | null;
    otpExpiry?: Date | null;
    signToken: () => string;
    comparePassword: (password: string) => Promise<boolean>;
};
export declare const User: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}, mongoose.DefaultSchemaOptions> & {
    username: string;
    email: string;
    password: string;
    otp?: string | null;
    otpExpiry?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    otp?: string | null;
    otpExpiry?: Date | null;
    signToken: () => string;
    comparePassword: (password: string) => Promise<boolean>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, UserDocument>;
export {};
//# sourceMappingURL=user.model.d.ts.map