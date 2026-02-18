"use client";

import React, { useState } from "react";

const navLinks = [
  { name: "HOME", href: "https://www.amcolhardwarett.com/index.php" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CONSTRUCTION", href: "https://www.amcolhardwarett.com/construction.php" },
  { name: "INDUSTRIAL", href: "/industrial" },
  { name: "DEPARTMENTS", href: "/departments" },
  { name: "CONTACT US", href: "/contact" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    urgency: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    alert("Thank you for your inquiry. A representative will contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
       
        <nav className="w-full border-t-2 border-red-600 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-1 flex-wrap items-center justify-center overflow-x-auto">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="border-l border-zinc-200 last:border-r"
              >
                <a
                  href={link.href}
                  className={`inline-block px-6 py-4 text-sm font-bold tracking-tight transition-colors hover:bg-zinc-50 
                    ${
                      link.name === "CONTACT US"
                        ? "text-red-600"
                        : "text-zinc-700 hover:text-red-600"
                    }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6">
            <img
              src="/images/AMCOL_Logo.png"
              alt="AMCOL Logo"
              className="h-24 w-auto transition-transform duration-300 hover:scale-105 drop-shadow-md"
            />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#1A1A1B] pt-48 pb-24 sm:pt-64 sm:pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 grayscale mix-blend-overlay"
            style={{ backgroundImage: "url('/images/Heritage Industry.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1B]/80 via-[#1A1A1B]/70 to-[#1A1A1B]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
  Supplying <span className="text-red-600">Excellence</span>.
  <br />
  <span className="text-zinc-400">Built for Industry.</span>
</h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Streamlined procurement for enterprise projects. Connect directly
            with our specialized teams for structural supply, fleet maintenance,
            and bulk orders.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative z-20 -mt-16 mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Priority Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-50 px-8 py-6 border-b border-zinc-200">
              <h2 className="text-2xl font-bold text-[#1A1A1B] flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500 animate-pulse"></span>
                Priority Inquiry
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Direct line to project estimation and procurement.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Direct Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="projectType"
                    className="block text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  >
                    <option value="">Select Type...</option>
                    <option value="Structural Supply">Structural Supply</option>
                    <option value="Fleet Maintenance">Fleet Maintenance</option>
                    <option value="Bulk Procurement">Bulk Procurement</option>
                    <option value="Safety Equipment">Safety Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="urgency"
                    className="block text-sm font-semibold leading-6 text-zinc-900"
                  >
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  >
                    <option value="">Select Urgency...</option>
                    <option value="Critical">Critical (24h)</option>
                    <option value="High">High (2-3 Days)</option>
                    <option value="Standard">Standard (1 Week)</option>
                    <option value="Planning">Planning Phase</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-zinc-900"
                >
                  Project Details / Requirements
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 bg-zinc-50"
                  placeholder="Please describe your specific needs, part numbers, or volume requirements..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-[#1A1A1B] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          {/* Direct Access Channels (Sidebar) */}
          <div className="space-y-6">
            {/* Corporate Sales Card */}
            <div className="bg-[#1A1A1B] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <h3 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2">
                Corporate Sales
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">
                    Head of Industrial Sales
                  </p>
                  <p className="font-semibold text-lg">John Doe</p>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:+18685550123"
                    className="hover:text-white transition-colors"
                  >
                    +1 (868) 555-0123 ext. 104
                  </a>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:sales@amcol.com"
                    className="hover:text-white transition-colors"
                  >
                    Sales1@amcolgroup.com
                  </a>
                </div>
              </div>
            </div>

            {/* Technical Support Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-200">
              <h3 className="text-xl font-bold mb-4 text-[#1A1A1B] border-b border-zinc-100 pb-2">
                Technical Support
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Lead Engineer
                  </p>
                  <p className="font-semibold text-lg text-zinc-900">
                    Sarah Chen
                  </p>
                </div>
                <div className="flex items-center gap-3 text-zinc-600">
                  <svg
                    className="h-5 w-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:+18685550124"
                    className="hover:text-[#1A1A1B] transition-colors"
                  >
                    +1 (868) 555-0124 ext. 202
                  </a>
                </div>
                <div className="flex items-center gap-3 text-zinc-600">
                  <svg
                    className="h-5 w-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <a
                    href="mailto:support@amcol.com"
                    className="hover:text-[#1A1A1B] transition-colors"
                  >
                    support@amcol.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links / Info */}
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
              <h4 className="font-semibold text-zinc-900 mb-2">
                Operating Hours
              </h4>
              <p className="text-sm text-zinc-600 mb-4">
                Mon - Fri: 7:00 AM - 5:00 PM
                <br />
                Sat: 7:00 AM - 4:00 PM
              </p>

              <h4 className="font-semibold text-zinc-900 mb-2">Main Office</h4>
              <p className="text-sm text-zinc-600">
                # 22 Ramjohn Trace,
                <br />
                Penal, Trinidad & Tobago
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-sm font-medium text-zinc-500">AMCOL</span>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}