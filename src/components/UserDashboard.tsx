import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Dumbbell, Search, MapPin } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

type Gym = {
  id: string;
  gymName: string;
  city: string;
  gmapLocation: string;
  openHours: string;
  perDayCost: number;
  holidays: string[];
};

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const cities = ["Porto", "Mumbai", "Visakhapatnam", "Hyderabad"];

  const handleSearch = async () => {
    if (!city) {
      alert("Please select a city");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      setOpen(false);

      const q = query(
        collection(db, "gyms"),
        where("city", "==", city)
      );

      const snapshot = await getDocs(q);

      const results: Gym[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          gymName: data.gymName || "",
          city: data.city || "",
          gmapLocation: data.gmapLocation || "",
          openHours: data.openHours || "",
          perDayCost: data.perDayCost || 0,
          holidays: Array.isArray(data.holidays)
            ? data.holidays
            : [],
        };
      });

      setGyms(results);
    } catch (error) {
      console.error("Error fetching gyms:", error);
      alert("Failed to fetch gyms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Dumbbell className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold">
              Welcome to Gym Per Day
            </h1>
          </div>

          <p className="text-slate-600 text-lg">
            Train anywhere, anytime — no subscriptions.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-lg"
          >
            <Search className="w-5 h-5" />
            Find a Gym
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-slate-600">
            Searching gyms...
          </p>
        )}

        {/* RESULTS */}
        {!loading && gyms.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <div
                key={gym.id}
                className="bg-white rounded-xl shadow p-6 space-y-3"
              >
                <h3 className="text-xl font-bold">
                  {gym.gymName}
                </h3>

                <p>📍 {gym.city}</p>
                <p>🕒 {gym.openHours}</p>
                <p>💰 ₹{gym.perDayCost} / day</p>

                <p className="text-sm text-slate-500">
                  Holidays:{" "}
                  {gym.holidays.length > 0
                    ? gym.holidays.join(", ")
                    : "None"}
                </p>

                <div className="flex justify-between pt-3">
                  <a
                    href={gym.gmapLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    View Map
                  </a>

                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && searched && gyms.length === 0 && (
          <div className="text-center mt-10">
            <h2 className="text-xl font-semibold">
              🚧 We are not there yet.
            </h2>

            <p className="text-slate-600 mt-2">
              Currently available in:
            </p>

            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {cities.map((c) => (
                <span
                  key={c}
                  className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEARCH DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
            <Dialog.Title className="text-xl font-bold">
              Find Gyms Near You
            </Dialog.Title>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg"
            >
              <option value="">Choose a city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSearch}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Find Gyms
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
