import axios from "axios";

const getCategory = (type: string) => {
    switch (type) {
        case 'Жильё': return 'accommodation';
        case 'Магазины': return 'commercial';
        case 'Кафе': return 'catering.cafe';
        case 'Кино': return 'entertainment.cinema';
        case 'Больницы': return 'healthcare';
        case 'Одежда': return 'commercial.clothing';
        case 'Ресторан': return 'catering.restaurant';
        case 'Клубы': return 'adult.nightclub';
    }

}

const getPlace = async (city: string, type: string) => {
    let category = getCategory(type);
    const resId = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=${process.env.PLACE_TOKEN}`)
        .then((res) => res.data.results[0].place_id)
    return await axios.get(`https://api.geoapify.com/v2/places?categories=${category}&filter=place:${resId}&limit=3&apiKey=${process.env.PLACE_TOKEN}`)
        .then((result) => result.data.features)
}
export default getPlace;