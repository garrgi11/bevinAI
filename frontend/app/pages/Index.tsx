"use client"

import HeroPM from "../components/sections/HeroPM"
import UseCases from "../components/sections/UseCases"
import Features from "../components/sections/Features"
import Integrations from "../components/sections/Integrations"

export default function Index() {
  return (
    <div className="relative bg-white">
      <HeroPM />
      <UseCases />
      <Features />
      <Integrations />
      <section id="cta" className="relative bg-white">
        <div className="container pb-20 pt-4">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/50 p-6 text-center ring-1 ring-orange-100">
            <h3 className="text-xl font-semibold text-neutral-900">Bring Bevin.AI to your team</h3>
            <p className="mt-2 text-neutral-600">
              We're partnering with select product organizations. Request early access.
            </p>
            <form
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault()
                alert("Thanks! We will be in touch.")
              }}
            >
              <input
                type="email"
                required
                placeholder="Work email"
                className="h-11 rounded-md border border-orange-200 bg-white px-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none ring-1 ring-transparent transition focus:border-orange-300 focus:ring-orange-200"
              />
              <button
                type="submit"
                className="h-11 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-amber-400"
              >
                Request access
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
