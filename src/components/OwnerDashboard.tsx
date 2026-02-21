import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Dumbbell, Plus, Building2 } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

/* ------------------ Validators ------------------ */

// Google Maps URL
const isValidGoogleMapsUrl = (url: string) => {
  return /^https:\/\/(www\.)?(google\.com\/maps|maps\.google\.com)/.test(url);
};

// Gym name must start with alphabet
const isValidGymName = (name: string) => {
  return /^[A-Za-z][A-Za-z0-9\s]*$/.test(name);
};

// Open hours format: 12am-9pm
const isValidOpenHours = (value: string) => {
  return /^(1[0-2]|[1-9])(am|pm)-(1[0-2]|[1-9])(am|pm)$/i.test(value);
};

// Per day cost: integer, no leading zero
const isValidCost = (value: string) => {
  return /^[1-9]\d*$/.test(value);
};

export default function OwnerDashboard() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const [form, setForm] = useState({
    gymName: "",
    city: "",
    gmapLocation: "",
    openHours: "",
    perDayCost: "",
    holidays: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleHoliday = (day: string) => {
    if (form.holidays.includes(day)) {
      setForm({
        ...form,
        holidays: form.holidays.filter((d) => d !== day),
      });
    } else {
      setForm({
        ...form,
        holidays: [...form.holidays, day],
      });
    }
  };

  const resetForm = () => {
    setForm({
      gymName: "",
      city: "",
      gmapLocation: "",
      openHours: "",
      perDayCost: "",
      holidays: [],
    });
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in.");
        return;
      }

      if (!isValidGymName(form.gymName)) {
        setError("Gym name must start with a letter.");
        return;
      }

      if (!form.city) {
        setError("Please select a city.");
        return;
      }

      if (!isValidGoogleMapsUrl(form.gmapLocation)) {
        setError("Invalid Google Maps URL.");
        return;
      }

      if (!isValidOpenHours(form.openHours)) {
        setError("Open hours must be like 6am-10pm.");
        return;
      }

      if (!isValidCost(form.perDayCost)) {
        setError(
          "Per Day Cost must be a positive integer without leading zero."
        );
        return;
      }

      setError("");

      await addDoc(collection(db, "gyms"), {
        ...form,
        perDayCost: Number(form.perDayCost),
        ownerId: user.uid,
        createdAt: new Date(),
      });

      resetForm();
      setOpen(false);
      navigate("/my-gyms");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save gym.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold">Gym Per Day – Owner Hub</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-gyms")}
              className="flex items-center gap-2 px-5 py-2 border rounded-lg hover:bg-gray-100"
            >
              <Building2 className="w-4 h-4" />
              My Gyms
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Add Gym
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to Gym Per Day 🏋️‍♂️
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            Gym Per Day is a flexible booking platform designed for gym owners
            who want to offer their fitness facilities on a daily basis.
          </p>

          <p className="text-gray-600 leading-relaxed mb-4">
            As a gym owner, you can:
          </p>

          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Register your gym with full details and location.</li>
            <li>Set daily pricing for customers.</li>
            <li>Define opening hours and holiday schedules.</li>
            <li>Manage and update your gym information anytime.</li>
          </ul>

          <p className="mt-6 text-emerald-700 font-medium">
            Start by adding your gym and make your services available per day.
          </p>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold">
              Register Your Gym
            </Dialog.Title>

            <input
              name="gymName"
              placeholder="Gym Name"
              value={form.gymName}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>

            <input
              name="gmapLocation"
              placeholder="Google Maps URL"
              value={form.gmapLocation}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              name="openHours"
              placeholder="6am-10pm"
              value={form.openHours}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              name="perDayCost"
              placeholder="Per Day Cost"
              value={form.perDayCost}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
            />

            <div>
              <p className="mb-2 font-medium">Select Holidays</p>
              <div className="grid grid-cols-2 gap-2">
                {days.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.holidays.includes(day)}
                      onChange={() => toggleHoliday(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setError("");
                  setOpen(false);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Save Gym
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
