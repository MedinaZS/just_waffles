const API_URL = 'http://localhost:8000/api'

export const API_ROUTES = {
    LOGIN: `${API_URL}/user/login`,
    LOGOUT: `${API_URL}/user/logout`,
    REGISTER: `${API_URL}/user/register`,
    GET_USER: `${API_URL}/user/auth`,
    UPDATE_USER: `${API_URL}/user/edit`,
    DELETE_USER: `${API_URL}/user/delete/`, //se pasa id por eso la ultima barra

    SAVE_ORDER: `${API_URL}/order/new`,
    GET_ORDERS: `${API_URL}/order/list/`, //se pasa id por eso la ultima barra
    UPDATE_ORDER: `${API_URL}/order/edit`,
    GET_ONE_ORDER: `${API_URL}/order/`, //se pasa id por eso la ultima barra
}

export const APP_ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login',
    HOME: '/',
    ORDER: '/order',
    CRAFT_A_WAFFLE: '/craft-a-waffle',
    ACCOUNT: '/account',
}

export const WAFFLE_OPTIONS = {
    PRICE_SMALL: 15000,
    PRICE_LARGE: 20000,
    PRICE_PER_TOPPING: 1000,

    SIZES: ["Small", "Large"],

    DOUGH_TYPE: ["Vanilla", "Chocolate", "Cinnamon", "Potato", "Cheese", "Cassava", "Sweet Potato"],
    // TOPPINGS_DULCES : [{"Chocolate chips", "Mantequilla de mani", "Nutella", "Dulce de leche"}],

    TOPPINGS: {
        sweet: [{
            title: "Chocolate chips",
            checked: false
        },
        {
            title: "Peanut Butter",
            checked: false
        },
        {
            title: "Nutella",
            checked: false
        },
        {
            title: "Caramel",
            checked: false
        }],

        fruit: [{
            title: "Banana",
            checked: false
        },
        {
            title: "Peach",
            checked: false
        },
        {
            title: "Strawberry",
            checked: false
        },
        {
            title: "Kiwi",
            checked: false
        }],

        salty: [{
            title: "Mozzarella cheese",
            checked: false
        },
        {
            title: "Bacon",
            checked: false
        },
        {
            title: "Smoked Ham",
            checked: false
        },
        {
            title: "Egg",
            checked: false
        }]
    }

    // TOPPINGS_DULCES: [{
    //     title: "Chocolate chips",
    //     checked: true
    // },
    // {
    //     title: "Mantequilla de mani",
    //     checked: false
    // },
    // {
    //     title: "Nutella",
    //     checked: false
    // },
    // {
    //     title: "Dulce de leche",
    //     checked: false
    // }],

    // // TOPPINGS_FRUTAS: ["Banana", "Durazno", "Frutilla", "Kiwi"],
    // TOPPINGS_FRUTAS: [{
    //     title: "Banana",
    //     checked: false
    // },
    // {
    //     title: "Durazno",
    //     checked: false
    // },
    // {
    //     title: "Frutilla",
    //     checked: false
    // },
    // {
    //     title: "Kiwi",
    //     checked: false
    // }],
    // // TOPPINGS_SALADOS: ["Queso Mozzarella", "Bacon", "Jamon Ahumado", "Huevo"]
    // TOPPINGS_SALADOS: [{
    //     title: "Queso Mozzarella",
    //     checked: false
    // },
    // {
    //     title: "Bacon",
    //     checked: false
    // },
    // {
    //     title: "Jamon Ahumado",
    //     checked: false
    // },
    // {
    //     title: "Huevo",
    //     checked: false
    // }],
}
