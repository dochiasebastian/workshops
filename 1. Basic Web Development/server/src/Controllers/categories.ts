import ErrorResponse from '../Util/ErrorResponse';
import asyncHandler from '../Middleware/Async';
import Category, { CategoryDocument } from '../Model/Category';

export const createCategory = asyncHandler(async (req: any, res:any) => {
    const { text } = req.body;

    const category = await Category.create({
        text
    });

    res.status(200).json({
        success: true,
        data: category
    });
});

export const deleteCategory = asyncHandler(async (req: any, res: any, next: any) => {
    const category: CategoryDocument = await Category.findByIdAndDelete(req.body.id);

    if (!Category) {
        return next(new ErrorResponse(`Category not found with id ${req.body.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
});

export const getCategory = asyncHandler(async (req: any, res: any) => {
    const category = await Category.find();

    res.status(200).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: any, res: any, next: any) => {
    const category = await Category.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!category) {
        return next(new ErrorResponse(`Category not found with id ${req.body.id}`, 404));
    }
});