import axios from "axios";

let category: {[key: string]: string} = {
    'Жильё': 'accommodation',
    'Магазины': 'commercial',
    'Кафе': 'catering.cafe',
    'Кино': 'entertainment.cinema',
    'Больницы': 'healthcare',
    'Одежда': 'commercial.clothing',
    'Ресторан': 'catering.restaurant',
    'Клубы': 'adult.nightclub',
}

const getPlace = async (city: string, type: string) => {
    const resId = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=${process.env.PLACE_TOKEN}`)
        .then((res) => res.data.results[0].place_id)
    return await axios.get(`https://api.geoapify.com/v2/places?categories=${category[type]}&filter=place:${resId}&limit=3&apiKey=${process.env.PLACE_TOKEN}`)
        .then((result) => result.data.features)
}
export default getPlace;