
interface IProperties {
    lon: number,
    lat: number,
    name: string,
    street: string,
    housenumber: string,
}

interface IPlace {
    properties: IProperties;
}

export default IPlace;