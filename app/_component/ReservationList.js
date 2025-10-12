"use client"
import React, { useOptimistic } from 'react'
import ReservationCard from './ReservationCard'
import { deleteBooking } from '../_lib/actions'

export default function ReservationList({bookings}) {
 
 const [optimisticBookings,setOptimisticBookings]=useOptimistic(bookings,(curBookings,bookingId)=>{
return curBookings.filter(booking=>booking.id!==bookingId)

 })

 async function handleDelete(bookingId){
    setOptimisticBookings(bookingId)

    await deleteBooking(bookingId)
 } 
    
 
 
 
 
 
 return (
   <ul className="space-y-6">
          {optimisticBookings.map((booking) => (
            <ReservationCard onDelete={handleDelete} booking={booking} key={booking.id} />
          ))}
        </ul>
  )
}
