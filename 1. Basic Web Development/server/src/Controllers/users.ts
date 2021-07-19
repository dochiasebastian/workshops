import asyncHandler from '../Middleware/Async';
import ErrorResponse from '../Util/ErrorResponse';
import User from '../Model/User';
import sendTokenResponse from '../Util/SendTokenResponse';

export const register = asyncHandler(async (req: any, res: any, next: any) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

export const login = asyncHandler(async (req: any, res: any, next:any) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please Provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatched = await (user as any).matchPassword(password);

    if (!isMatched) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req: any, res: any, next: any) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

export const logout = asyncHandler(async (req: any, res: any, next: any) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 *1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    });
});