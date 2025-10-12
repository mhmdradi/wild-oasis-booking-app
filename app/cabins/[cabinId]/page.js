import Cabin from "@/app/_component/Cabin";
import Reservation from "@/app/_component/Reservation";
import Spinner from "@/app/_component/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

// PLACEHOLDER DATA
export const revalidate=0
//error function of generate meta data
// export async function generateMetadata(params) {
//   const name=await getCabin(params.cabinId)
//   return{title:`cabin ${name}`}
  
// }

export async function generateMetadata({ params }) {
  const cabin = await getCabin(params.cabinId)
  return {
    title: `Cabin ${cabin.name}`
  }
}

export async function generateStaticParams(){

  const cabins=await getCabins()
  const ids=cabins.map(cabin=>{cabinId:String(cabin.id)})
  return ids
}

export default async function Page({ params }) {
  
  const cabin = await getCabin(params.cabinId);
  const { id, name, maxCapacity, regularPrice, discount, image, description } =cabin;
  return (
    
    <div>
        <Cabin cabin={cabin}/>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner/>}>
        <Reservation cabin={cabin}/>
        </Suspense>
      </div>
    
  );
}
