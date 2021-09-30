export const idValidator = (id: string): boolean => {
    const re = /^[0-9]{8}$/;
    return re.test(id)
}

export const phoneValidator = (phone: string): boolean => {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone)
}

export const nameValidator = (name: string): boolean => {
    return true;
}
