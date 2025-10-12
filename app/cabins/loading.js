import Spinner from "../_component/Spinner";

export default function loading() {
  return (
    <div className="grid items-center justify-center">
      <Spinner />
      <p className="text-xl text-primary-200">Loading Cabin data...</p>
    </div>
  );
}
