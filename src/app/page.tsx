// src/app/page.tsx
import React, { useState } from "react";
import Link from "next/link";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWpexplorer, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useRotate } from "../components/Userotate";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// Define the structure of the page object
interface Page {
  id: number;
  name: string;
  pathname: string;
  unavailable: boolean;
}

// Page variable used in Explore expandable to map over any future links added into array
const pages: Page[] = [
  { id: 1, name: "Home", pathname: "/", unavailable: false },
  { id: 2, name: "About", pathname: "/info", unavailable: false },
];

const Home: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(pages[0]);
  const rotate = useRotate(); // Get the rotate MotionValue

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow bg-neutral-200 p-8">
        <div className="flex justify-between">
          <div className="flex">
            <img
              className="w-16 rounded-full drop-shadow-lg p-1"
              src="https://i.imgur.com/hdOhoXL.jpg"
              alt="Logo"
            />
            <motion.div
              style={{ rotate }}
              animate={{ x: [1, 4, 0.5] }}
              whileHover={{ scale: 1.1 }}
            >
              <Link href="https://www.instagram.com/bodybellrecords/">
                <a className="flex justify-center w-8 rounded-lg text-2xl m-3">
                  <FontAwesomeIcon icon={faInstagram} className="pt-3 pb-2" />
                </a>
              </Link>
            </motion.div>
          </div>
          <div className="pr-4">
            <div className="flex flex-row">
              <Listbox value={selectedPage} onChange={setSelectedPage}>
                <ListboxButton className="pt-4 text-xl">
                  Explore <FontAwesomeIcon icon={faWpexplorer} />
                </ListboxButton>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <ListboxOptions className="pl-2 pt-1">
                    {pages.map((page) => (
                      <ListboxOption
                        key={page.id}
                        value={page}
                        disabled={page.unavailable}
                        className="pt-1 rounded-lg"
                      >
                        <motion.div
                          style={{ rotate }}
                          animate={{ x: [1, 4, 0.5] }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Link href={page.pathname}>
                            <a>{page.name}</a>
                          </Link>
                        </motion.div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </Listbox>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 h-0.5 mt-8"></div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
