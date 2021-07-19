import ErrorResponse from '../Util/ErrorResponse';
import asyncHandler from '../Middleware/Async';
import Permission from '../Model/Permissions';

export const create = asyncHandler(async (req: any, res: any) => {
    const { type, text, id } = req.body;

    const permission = await Permission.create({
        type,
        text,
        id
    });

    res.status(200).json({
        success: true,
        data: permission
    });
});


