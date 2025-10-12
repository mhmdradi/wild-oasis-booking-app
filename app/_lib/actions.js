"use server"

import { revalidatePath } from "next/cache"
import { auth, signIn, signOut } from "./auth"
import { supabase } from "./supabase"
import { getBookings } from "./data-service"
import { redirect } from "next/navigation"




export async function updateGuest(formData) {
    const session=await auth()
    if(!session) throw new Error("you must logged in")
        const nationalID=formData.get("nationalID")
    const [nationality,countryFlag]=formData.get("nationality").split("%")

    if(!/^[a-zA-Z0-9]{6,14}$/.test(nationalID)) throw new Error("Invalid national ID number. It should be alphanumeric and between 6 to 12 characters long.")

const updateData={nationality,countryFlag,nationalID}



const { data, error } = await supabase
     .from("guests")
     .update(updateData)
     .eq("id", session.user.guestId)
 

   if (error) {
     throw new Error("Guest could not be updated");
   }
   return data;


revalidatePath("/account/profile")
    }


export async function createBooking(bookingData,formData) {
  const session=await auth()
         if(!session) throw new Error("you must logged in") 

            const newBooking={
                ...bookingData,
                guestId:session.user.guestId,
                numGuests:Number(formData.get("numGuests")),
                observations:formData.get("observations").slice(0,1000),
                    extrasPrice:0,
                    totalPrice:bookingData.cabinPrice,
                    isPaid:false,
                    hasBreakfast:false,
                    status:"unconfirmed"
            }

 const { error } = await supabase
    .from("bookings")
    .insert([newBooking])
   

  if (error) {

    throw new Error("Booking could not be created");
  }

revalidatePath(`/cabins/${bookingData.cabinId}`)

redirect("/cabins/thankyou")


}


    export async function deleteBooking(bookingId) {
        const session=await auth()
         if(!session) throw new Error("you must logged in") 

 const guestBookings=await getBookings(session.user.guestId)
 const guestBookingIds=guestBookings.map(booking=>booking.id)

if(!guestBookingIds.includes(bookingId)){
    throw new Error("you are not allowed to delete this booking")
}
        
         const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

  if (error) {
     console.error(error);
          throw new Error("Booking could not be deleted");
        }
revalidatePath("/account/reservations")

    }

export async function updateBooking(formData){
  const bookingId=Number(formData.get("bookingId"))
  
    //1)Authentication  
    
    const session=await auth()
         if(!session) throw new Error("you must logged in") 
//2)Authorization
 const guestBookings=await getBookings(session.user.guestId)
 const guestBookingIds=guestBookings.map(booking=>booking.id)

if(!guestBookingIds.includes(bookingId)){
    throw new Error("you are not allowed to update this booking")
}

//3)building update date

const updateData={
    numGuests:Number(formData.get("numGuests")),
    observations:formData.get("observations").slice(0,1000)

}




const { error } = await supabase
     .from("bookings")
     .update(updateData)
     .eq("id", bookingId)
     .select()
     .single();

     //4)error handling
     if (error) {
         throw new Error("Booking could not be updated");
        }

        revalidatePath(`/account/reservations/edit/${bookingId}`)
        revalidatePath("/account/reservations")
        //5)mutation
  redirect("/account/reservations")


 }

export async function signInAction(){
    await signIn("google",{redirectTo:"/account"})
}


export async function signOutAction(){
    await signOut({redirectTo:"/"})
}