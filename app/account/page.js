import { auth } from "../_lib/auth";

export const metadata = {
  title: "Guest Area",
};

async function page() {
  const session=await auth()
  console.log(session)
  const fName=session.user.name.split(" ").at(0)
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome, {fName}
      </h2>
    </div>
  );
}

export default page;
