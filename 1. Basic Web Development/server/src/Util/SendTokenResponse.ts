// Get token from model. create cookie and send response
const sendTokenResponse = (user: any, statusCode: number, res: any) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    (options as any).secure = true;

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

export default sendTokenResponse;