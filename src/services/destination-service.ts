import { Drink, Restaurant, Event, Sleep, City, Event2, Hotel } from "../types"
import { API_URL } from "../constantes"

export type DiscoveryResponse = {
	city: City
	drink: Drink[]
	enjoy: Event[]
	restaurant: Restaurant[]
	sleep: Sleep[]
	hotels: Hotel[]
	events: Event2[]
}

export async function discover(city: string, { from, to }: { from: number; to: number }): Promise<DiscoveryResponse> {
	const params = new URLSearchParams()
	params.append("count", "10")
	from && params.append("from", from.toString())
	to && params.append("to", to.toString())
	const res = await fetch(API_URL + "/discover/" + city + "?" + params.toString(), {
		headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "*" },
	})
	if (!res.ok) throw new Error(res.statusText)
	const data = (await res.json()) as DiscoveryResponse
	data.events = data.events.map<Event>((e: any) => {
		return {
			name: e.title,
			location: {
				lat: e.location.lat,
				lng: e.location.lng,
			},
			photos: [e.thumbnail],
			rating: e.venue.rating,
			reference: encodeURIComponent(e.title),
			types: ["events"],
			totalRatings: e.venue.reviews,
			address: e.address.join(", "),
			link: e.link,
			isGoogle: false,
		}
	})
	data.sleep = data.hotels.map<Sleep>((e: any) => {
		return {
			name: e.hotel_name_trans,
			location: {
				lat: e.latitude,
				lng: e.longitude,
			},
			photos: [e.main_photo_url],
			rating: e.review_score / 2,
			reference: e.id,
			types: ["lodging"],
			totalRatings: e.review_nr,
			address: [e.address_trans, e.city_trans, e.country_trans].join(", "),
			link: e.url,
			isGoogle: false,
		}
	})
	return data
}
