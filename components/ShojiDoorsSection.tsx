"use client";

import { useRef, useState } from "react";

export default function ShojiDoorsSection() {
  const [openDoor, setOpenDoor] = useState<string | null>(null);

  const doors = [
    { id: "asia", label: "Asia", image: "/assets/Door-Asia.png", description: "Quiet ryokans, private villas & unhurried days" },
    { id: "europe", label: "Europe", image: "/assets/Door-Europe.png", description: "Boutique stays, great food & private drivers" },
    { id: "america", label: "America", image: "/assets/Door-America.png", description: "Refined escapes & slow travel" },
  ];

  const toggleDoor = (doorId: string) => {
    setOpenDoor(openDoor === doorId ? null : doorId);
  };

  return (
    <section className="w-full bg-black">
      {/* Desktop: Sandwich layer with 3 doors side by side */}
      <div className="hidden md:block relative w-full">
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <img src="/assets/room-all.png" alt="Room background" className="absolute inset-0 w-full h-full object-cover" />

          {doors.map((door, idx) => {
            const leftPosition = [8.8, 27, 45.2][idx];
            return (
              <div
                key={door.id}
                className="door-cutout absolute top-0 h-full cursor-pointer overflow-hidden transition-transform duration-600"
                style={{
                  left: `${leftPosition}%`,
                  width: "18.2%",
                }}
                onClick={() => toggleDoor(door.id)}
              >
                <img src={door.image} alt={door.label} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            );
          })}

          <img src="/assets/room Empty_.png" alt="Empty room" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        </div>
      </div>

      {/* Mobile: Stacked scrollable doors with sandwich layers */}
      <div className="md:hidden relative w-full">
        {/* Background layer */}
        <div className="relative w-full h-screen">
          <img src="/assets/room-all.png" alt="Room background" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        {/* Scrollable doors */}
        {doors.map((door) => (
          <div
            key={door.id}
            className="relative w-full h-screen cursor-pointer overflow-hidden transition-transform duration-600"
            onClick={() => toggleDoor(door.id)}
          >
            <img src={door.image} alt={door.label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
              <h3 className="text-4xl font-bold text-white">{door.label}</h3>
              <p className="text-center text-gray-200 text-base mt-4 px-8 max-w-xs">{door.description}</p>
            </div>
          </div>
        ))}

        {/* Empty room overlay layer */}
        <div className="relative w-full h-screen">
          <img src="/assets/room Empty_.png" alt="Empty room" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center py-12 bg-black">
        <button className="bg-yellow-600 hover:bg-yellow-700 text-black px-8 py-3 font-semibold transition rounded">
          Click here to continue
        </button>
      </div>
    </section>
  );
}
