import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Dumbbell, MapPin, Pencil } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { Dialog } from "@headlessui/react";

type Gym = {
  id: string;
  gymName: string;
  city: string;
  gmapLocation?: string;
  openHours: string;
  perDayCost: string;
  holidays: string[] | string; // safe type
};

const cities = ["Porto", "Mumbai", "Visakhapatnam", "Hyderabad"];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// VALIDATIONS
const isValidGoogleMapsUrl = (url: string) =>
  /^https:\/\/(www\.)?(google\.com\/maps|maps\.google\.com)/.test(url);

const isValidName = (name: string) => /^[A-Za-z]/.test(name);

const isValidOpenHours = (hours: string) =>
  /^(1[0-2]|[1-9])(am|pm)-(1[0-2]|[1-9])(am|pm)$/.test(hours);

const isValidCost = (cost: string) => /^[1-9]\d*$/.test(cost);

export default function MyGyms() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "gyms"),
          where("ownerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const gymsList: Gym[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Gym, "id">),
        }));

        setGyms(gymsList);
      } catch (err) {
        console.error("Error fetching gyms:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const normalizeHolidays = (holidays: string[] | string | undefined) => {
    if (!holidays) return [];
    if (Array.isArray(holidays)) return holidays;
    return [holidays]; // convert old string data
  };

  const handleUpdate = async () => {
    if (!selectedGym) return;

    if (!isValidName(selectedGym.gymName))
      return setError("Gym name must start with an alphabet.");

    if (!isValidGoogleMapsUrl(selectedGym.gmapLocation || ""))
      return setError("Invalid Google Maps URL.");

    if (!isValidOpenHours(selectedGym.openHours))
      return setError("Open hours format: 6am-9pm");

    if (!isValidCost(selectedGym.perDayCost))
      return setError("Cost must be integer and not start with zero.");

    setError("");

    await updateDoc(doc(db, "gyms", selectedGym.id), {
      gymName: selectedGym.gymName,
      city: selectedGym.city,
      gmapLocation: selectedGym.gmapLocation,
      openHours: selectedGym.openHours,
      perDayCost: selectedGym.perDayCost,
      holidays: normalizeHolidays(selectedGym.holidays),
    });

    setGyms((prev) =>
      prev.map((gym) =>
        gym.id === selectedGym.id
          ? { ...selectedGym, holidays: normalizeHolidays(selectedGym.holidays) }
          : gym
      )
    );

    setOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your gyms...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Dumbbell className="w-7 h-7 text-emerald-600" />
          <h1 className="text-3xl font-bold">My Registered Gyms</h1>
        </div>

        {gyms.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            No gyms registered yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {gyms.map((gym) => (
              <div key={gym.id} className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold text-emerald-600 mb-2">
                  {gym.gymName}
                </h2>

                <p><b>City:</b> {gym.city}</p>
                <p><b>Open Hours:</b> {gym.openHours}</p>
                <p><b>Cost:</b> ₹{gym.perDayCost}</p>

                <p>
                  <b>Holidays:</b>{" "}
                  {normalizeHolidays(gym.holidays).join(", ") || "None"}
                </p>

                {gym.gmapLocation && (
                  <a
                    href={gym.gmapLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 flex items-center gap-2 mt-2"
                  >
                    <MapPin className="w-4 h-4" />
                    View Map
                  </a>
                )}

                <button
                  onClick={() => {
                    setSelectedGym({
                      ...gym,
                      holidays: normalizeHolidays(gym.holidays),
                    });
                    setOpen(true);
                  }}
                  className="mt-4 flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4">
            <Dialog.Title className="text-xl font-bold">
              Edit Gym
            </Dialog.Title>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {selectedGym && (
              <>
                <input
                  value={selectedGym.gymName}
                  onChange={(e) =>
                    setSelectedGym({
                      ...selectedGym,
                      gymName: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="Gym Name"
                />

                <select
                  value={selectedGym.city}
                  onChange={(e) =>
                    setSelectedGym({
                      ...selectedGym,
                      city: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                >
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>

                <input
                  value={selectedGym.gmapLocation || ""}
                  onChange={(e) =>
                    setSelectedGym({
                      ...selectedGym,
                      gmapLocation: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="Google Maps URL"
                />

                <input
                  value={selectedGym.openHours}
                  onChange={(e) =>
                    setSelectedGym({
                      ...selectedGym,
                      openHours: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="6am-9pm"
                />

                <input
                  value={selectedGym.perDayCost}
                  onChange={(e) =>
                    setSelectedGym({
                      ...selectedGym,
                      perDayCost: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                  placeholder="Cost"
                />

                <div>
                  <p className="font-medium mb-2">Holidays</p>
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((day) => (
                      <label key={day} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={normalizeHolidays(
                            selectedGym.holidays
                          ).includes(day)}
                          onChange={(e) => {
                            const current = normalizeHolidays(
                              selectedGym.holidays
                            );

                            const updated = e.target.checked
                              ? [...current, day]
                              : current.filter((d) => d !== day);

                            setSelectedGym({
                              ...selectedGym,
                              holidays: updated,
                            });
                          }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
