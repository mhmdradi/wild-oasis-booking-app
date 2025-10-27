// // auth.ts
// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import { createGuest, getGuest } from "./data-service"
// // export const { auth, handlers } = NextAuth({ providers: [Google] })

// const authConfig={
//     providers:[
//         Google({
//             clientId: process.env.AUTH_GOOGLE_ID,
//             clientSecret: process.env.AUTH_GOOGLE_SECRET,
            
//         })
//     ],
//     callbacks:{
//         authorized({auth,request}){
//             return !!auth?.user
//         },
//       async  signIn({user,profile,account}){
//             try{
//                 const existingGuest=await getGuest(user.email)
//                 if(!existingGuest)await createGuest({email:user.email,fullName:user.name})
//                 return true
//             }catch{
//                 return false
//             }
//         },
//         async session({session,user}){
//             const guest=await getGuest(session.user.email)
//  session.user.guestId=guest.id
//  return session
//         }
//     },
//     pages:{
// signIn:"/login"
//     }
    
// }


// export const{auth,signIn,signOut,handlers:{GET,POST}}=NextAuth(authConfig)


// auth.js
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createGuest, getGuest } from "./data-service"

const googleId = process.env.AUTH_GOOGLE_ID
const googleSecret = process.env.AUTH_GOOGLE_SECRET
const nextAuthUrl = process.env.NEXTAUTH_URL
const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!googleId || !googleSecret) {
  throw new Error("Missing OAuth env vars: set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET")
}
if (!nextAuthUrl || !nextAuthSecret) {
  // NEXTAUTH_URL must match the domain in Google console for redirect URIs
  throw new Error("Missing NextAuth env vars: set NEXTAUTH_URL and NEXTAUTH_SECRET")
}

const authConfig = {
  providers: [
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user
    },
    async signIn({ user, profile, account }) {
      try {
        const existingGuest = await getGuest(user.email)
        if (!existingGuest) await createGuest({ email: user.email, fullName: user.name })
        return true
      } catch {
        return false
      }
    },
    async session({ session, user }) {
      const guest = await getGuest(session.user.email)
      session.user.guestId = guest.id
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(authConfig)
