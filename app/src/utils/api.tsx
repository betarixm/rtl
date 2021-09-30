import {URL_BACKEND} from "../env/url";

interface response {
    success: boolean;
}

interface resRegister extends response {
    errors?: Array<string>;
}

export const register = (id: string, name: string, phone: string): Promise<resRegister> => {
    return new Promise<resRegister>((resolve, reject) => {
        fetch(`${URL_BACKEND}/client/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                name: name,
                phone_number: phone
            })
        }).then(async (res) => {
            let r: resRegister = await res.json();
            if (r.success) {
                resolve(r);
            } else {
                reject(r);
            }
        }).catch((err) => {
            reject({
                success: false,
                errors: [err]
            })
        })
    })
}

export const checkClientExist = (id: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        fetch(`${URL_BACKEND}/client/check/${id}`, {
            method: "GET",
        }).then(async (res) => {
            let r: response = await res.json();
            resolve(r.success);
        }).catch((err) => {
            reject({
                success: false,
                errors: [err]
            })
        })
    })
}

export const checkEventExist = (id: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        fetch(`${URL_BACKEND}/event/check/${id}`, {
            method: "GET",
        }).then(async (res) => {
            let r: response = await res.json();
            resolve(r.success);
        }).catch((err) => {
            reject({
                success: false,
                errors: [err]
            })
        })
    })
}