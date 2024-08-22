type WrapperResponse = {
    code: number,
    status: string,
    message: string,
    data: object,
};
export function wrapperSuccess(res: any, data:any, message: string): WrapperResponse {
    return res.json({
        code: 200,
        status: 'Success',
        message: message,
        data,
    });
}

export function wrapperError(res: any, data:any, message: string, code: number): WrapperResponse {
    return res.json({
        code,
        status: 'Error',
        message: message,
        data,
    })
}
