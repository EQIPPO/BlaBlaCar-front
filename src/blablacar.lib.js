function request(url, method = "GET", data = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        headers["Content-Type"] = "application/json";
        fetch(url, {
            method: method,
            headers: headers,
            body: method != 'GET' ? JSON.stringify(data) : undefined
        }).then(response => {
            return response.json();
        }).then(data => {
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}

function post(url, data = {}, headers = {}) {
    return request(url, "POST", data, headers);
}

function get(url, data = {}, headers = {}) {
    return request(url, "GET", data, headers);
}

const API_URL = "http://192.168.0.2/api";

module.exports = {
    parseForm: (form) => {
        let data = {};
        for (let i = 0; i < form.length; i++) {
            if (form[i].type !== "submit")
                data[form[i].name] = form[i].value;
        }
        return data;
    },
    login: async (login, password) => {
        if (login === "" || password === "")
            throw "Логін та пароль не можуть бути пустими";

        const result = await post(API_URL + "/auth/login", { login: login, password: password });
        if (result.status === 200) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            return result.user;
        }
        else {
            switch (result.status) {
                case 400:
                    throw "Логін та пароль не можуть бути пустими";
                case 401:
                    throw "Невірний логін або пароль";
                default:
                    throw result.message;
            }
        }
    },
    register: async (name, login, password) => {
        const result = await post(API_URL + "/auth/register", { login: login, password: password, name: name });
        if (result.status === 200) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            return result.user;
        }
        else {
            switch (result.status) {
                default:
                    throw result.message;
            }
        }
    },
    isLoggedIn: () => {
        return localStorage.getItem("token") !== null;
    },
    getToken: () => {
        return localStorage.getItem("token");
    },
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem("user"));
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
    checkPerms: async () => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await get(API_URL + "/admin/perms", {}, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result.havePermission;
        }
        else {
            throw result.message;
        }
    },
    getProfile: async (id) => {
        if (!id && !module.exports.isLoggedIn())
            throw "Ви не авторизовані, або не вказано id користувача";

        if (!id)
            id = module.exports.getCurrentUser().id;

        const result = await get(API_URL + "/rating/user/" + id);

        if (result.status === 200) {
            return {
                name: result.name,
                average: result.average,
                comments: result.ratings,
                created_at: result.created_at
            };
        }
        else {
            if (result.status === 404)
                throw "Користувача не знайдено";
            throw result.message;
        }
    },
    postComment: async (id, comment) => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        if (id == module.exports.getCurrentUser().id)
            throw "Ви не можете залишити відгук самому собі";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await post(API_URL + "/rating/user/" + id, comment, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result;
        }
        throw result.message;
    },
    editName: async (name) => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        if (name == '')
            throw "Ім'я не може бути пустим";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await post(API_URL + "/auth/change-name", { name: name }, {
            'authorization': authToken
        });

        if (result.status === 200) {
            let user = module.exports.getCurrentUser();
            user.name = name;
            localStorage.setItem("user", JSON.stringify(user));
            return result;
        }
        throw result.message;
    }
}