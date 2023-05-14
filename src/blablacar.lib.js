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

function createQuery(data) {
    let query = "?";
    for (let key in data) {
        if (data[key] === undefined || data[key] === null)
            continue;

        if (data[key] instanceof String && data[key].length < 1)
            continue;

        if (data[key] instanceof Number && isNaN(data[key]))
            continue;

        query += key + "=" + data[key] + "&";
    }
    query = query.slice(0, -1);
    if (query.length < 1)
        return "";
    return query;
}

//const API_URL = "http://192.168.0.2/api";
const API_URL = "/api";

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
    },
    getHints: async (query) => {
        const result = await get(API_URL + "/trips/hints/?q=" + query);

        if (result.status === 200) {
            return result.hints;
        }
        throw result.message;
    },
    createRide: async (from, to, count, time, description) => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        if (from == '' || to == '' || count == '' || time == '')
            throw "Заповніть всі поля";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await post(API_URL + "/trips/", { start: from, end: to, passengers: count, time: time, description: description }, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result;
        }
        throw result.message;
    },
    getRides: async (from, to, passengers, timestamp) => {
        let headers = {};
        if (module.exports.isLoggedIn()) {
            let authToken = 'Bearer ' + localStorage.getItem("token");
            headers = {
                'authorization': authToken
            };
        }
        let query = createQuery({ start: from, end: to, passengers: passengers, time: timestamp });
        const result = await get(API_URL + "/trips/" + query, {}, headers);

        if (result.status === 200) {
            return result.trips;
        }
        throw result.message;
    },
    getTrip: async (id) => {
        let headers = {};
        if (module.exports.isLoggedIn()) {
            let authToken = 'Bearer ' + localStorage.getItem("token");
            headers = {
                'authorization': authToken
            };
        }
        const result = await get(API_URL + "/trips/" + id, {}, headers);

        if (result.status === 200) {
            return result.trip;
        }
        throw result.message;
    },
    getPassengerTrips: async () => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await get(API_URL + "/reservations/passenger", {}, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result.reservations;
        }
        throw result.message;
    },
    getDriverTrips: async () => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await get(API_URL + "/reservations/driver", {}, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result.trips;
        }
        throw result.message;
    },
    isTripReserved: async (id) => {
        if (!module.exports.isLoggedIn())
            return false;

        const passengerTrips = await module.exports.getPassengerTrips();
        for (let trip of passengerTrips) {
            if (trip.id == id)
                return true;
        }

        return false;
    },
    reserveTrip: async (id, comment) => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await post(API_URL + "/reservations/", { tripId: id, comment: comment }, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result;
        }
        throw result.message;
    },
    getOwnTrips: async () => {
        if (!module.exports.isLoggedIn())
            throw "Ви не авторизовані";

        const user = module.exports.getCurrentUser();

        const authToken = 'Bearer ' + localStorage.getItem("token")
        const result = await get(API_URL + "/trips/?driver_id=" + user.id, {}, {
            'authorization': authToken
        });

        if (result.status === 200) {
            return result.trips;
        }
        throw result.message;
    }
}