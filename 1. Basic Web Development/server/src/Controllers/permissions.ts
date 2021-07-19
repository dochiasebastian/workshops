import ErrorResponse from '../Util/ErrorResponse';
import asyncHandler from '../Middleware/Async';
import Permission, { PermissionDocument } from '../Model/Permissions';

export const createPermission = asyncHandler(async (req: any, res: any) => {
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

export const deletePermission = asyncHandler(async (req: any, res: any, next: any) => {
    const permission: PermissionDocument = await Permission.findByIdAndDelete(req.body.id);

    if (!permission) {
        return next(new ErrorResponse(`Permission not found with id ${req.body.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
});

export const getPermissions = asyncHandler(async (req: any, res: any) => {
    const permissions = await Permission.find();

    res.status(200).json({ success: true, data: permissions });
});

export const updatePermission = asyncHandler(async (req: any, res: any, next: any) => {
    const permission = await Permission.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!permission) {
        return next(new ErrorResponse(`Permission not found with id ${req.body.id}`, 404));
    }
});