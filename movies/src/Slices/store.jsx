import { configureStore } from "@reduxjs/toolkit"
import UserSlice from "./UserSlice"
import AdminSlice from "./AdminSlice"
import MoviesSlice from "./MoviesSlice"
import TheatreSlice from "./TheatreSlice"
import Theatres from "./Theatres"
import BookSlice from "./BookSlice"
import DashSlice from "./DashSlice"
import TicketSlice from "./TicketSlice"
import ValidateSlice from "./ValidateSlice"
import ClientNotify from "./ClientNotify"
import QuerySlice from "./QuerySlice"
import ResolveSlice from "./ResolveSlice"

const store = configureStore({
    reducer: {
        user: UserSlice,    
        admin: AdminSlice,
        movies: MoviesSlice,
        theatres: TheatreSlice,
        castingTheatres: Theatres,
        book: BookSlice,
        dash: DashSlice,
        revenue: TicketSlice,
        validate: ValidateSlice,
        client: ClientNotify,
        query: QuerySlice,
        resolve: ResolveSlice,
    },
})

store.subscribe((state)=>{
    console.log(store.getState())
})

export default store