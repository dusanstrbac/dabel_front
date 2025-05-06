export type LoginRequest = {
    email: string
    password: string
};

export type LoginResponse = {
    success: boolean
    message?: string
    token?: string
    user?: {
        id: string
        name: string
        email: string
    }
}

export type ErrorResponse = {
    error: string
    message?: string
}